import { getInjectMetadata } from './decorators/inject.decorator';
import { hasInjectableMetadata } from './decorators/injectable.decorator';
import { getOptionalMetadata } from './decorators/optional.decorator';
import { RuntimeException } from './exceptions/runtime.exception';
import { getProviderName } from './helpers/get-provider-name.helper';
import { getProviderToken } from './helpers/get-provider-token.helper';
import { getTokenName } from './helpers/get-token-name.helper';
import { isClassProvider } from './helpers/is-class-provider.helper';
import { isExistingProvider } from './helpers/is-existing-provider.helper';
import { isFactoryProvider } from './helpers/is-factory-provider.helper';
import { isForwardRef } from './helpers/is-forward-ref.helper';
import { isMultiProvider } from './helpers/is-multi-provider.helper';
import { isTypeProvider } from './helpers/is-type-provider.helper';
import { isValueProvider } from './helpers/is-value-provider.helper';
import { BeforeApplicationShutdown } from './interfaces/before-application-shutdown.interface';
import { ClassProvider } from './interfaces/class-provider.interface';
import { ExistingProvider } from './interfaces/existing-provider.interface';
import { FactoryProvider } from './interfaces/factory-provider.interface';
import { OnApplicationBoot } from './interfaces/on-application-boot.interface';
import { OnApplicationInit } from './interfaces/on-application-init.interface';
import { OnApplicationListen } from './interfaces/on-application-listen.interface';
import { OnApplicationShutdown } from './interfaces/on-application-shutdown.interface';
import { Provider } from './interfaces/provider.interface';
import { Token } from './interfaces/token.interface';
import { TypeProvider } from './interfaces/type-provider.interface';
import { Type } from './interfaces/type.interface';
import { ValueProvider } from './interfaces/value-provider.interface';
import { Logger } from './services/logger.service';
import { APP_REFERENCE } from './tokens/app-reference.token';

export class Application {
  public static async create(options: ApplicationOptions): Promise<Application> {
    const application: Application = await new Application(options.providers).init();

    (await application.find(Logger)).log('Starting application...');

    await application.registerShutdownHooks([]);
    await application.callOnApplicationBootHooks();
    await application.callOnApplicationInitHooks();

    return application;
  }

  private readonly providers: Provider[] = [];
  private readonly records: Record[] = [];

  protected constructor(providers: Provider[]) {
    this.providers = providers.reverse();
    this.providers.push({ provide: APP_REFERENCE, useValue: this });
  }

  public async filter(fn: (provider: Provider) => boolean): Promise<any[]> {
    const records: Record[] = [];

    for (const provider of this.providers.filter(it => fn(it))) {
      records.push(await this.resolveProvider(provider));
    }

    return records.map(it => it.value);
  }

  public async find<T = any>(token: Token<T>, defaultValue?: any): Promise<T> {
    const provider: Provider = this.getProviderByToken(token);

    if (provider === undefined) {
      if (defaultValue === undefined) {
        throw new RuntimeException(`Provider '${ token.toString() }' not found`);
      }

      return defaultValue;
    }

    return (await this.resolveProvider(provider)).value;
  }

  public async listen(): Promise<void> {
    await this.callOnApplicationListenHooks();
  }

  private async callOnApplicationBootHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationBoot).onApplicationBoot) {
        await provider.onApplicationBoot();
      }
    }
  }

  private async callOnApplicationInitHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationInit).onApplicationInit) {
        await provider.onApplicationInit();
      }
    }
  }

  private async callOnApplicationListenHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationListen).onApplicationListen) {
        await provider.onApplicationListen();
      }
    }
  }

  private async callBeforeApplicationShutdownHooks(signal: string): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as BeforeApplicationShutdown).beforeApplicationShutdown) {
        await provider.beforeApplicationShutdown(signal);
      }
    }
  }

  private async callOnApplicationShutdownHooks(signal: string): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationShutdown).onApplicationShutdown) {
        await provider.onApplicationShutdown(signal);
      }
    }
  }

  private async registerShutdownHooks(signals: string[]): Promise<void> {
    const listener = async (signal: string) => {
      try {
        await this.callBeforeApplicationShutdownHooks(signal);
        await this.callOnApplicationShutdownHooks(signal);

        signals.forEach(it => {
          process.removeListener(it, listener);
        });

        process.kill(process.pid, signal);
      } catch (error) {
        (await this.find(Logger)).error('An error occurred while shutting down');

        process.exit(1);
      }
    };

    for (const signal of signals) {
      process.on(signal as any, listener);
    }
  }

  private async init(): Promise<this> {
    for (const token of new Set(this.providers.filter(it => isMultiProvider(it)).map(it => getProviderToken(it))).values()) {
      const providers: Provider[] = this.providers.filter(it => getProviderToken(it) === token);

      if (providers.length >= 2 && new Set(providers.map(provider => (provider as any).multi)).size >= 2) {
        throw new RuntimeException(`Mixing multi and non multi provider is not possible for token ${ getTokenName(token) }`);
      }
    }

    await this.resolveProviders();

    return this;
  }

  private async resolveProviders(): Promise<void> {
    for (const provider of this.providers) {
      await this.resolveProvider(provider);
    }
  }

  private async resolveProvider(provider: Provider): Promise<Record> {
    const token: Token = getProviderToken(provider);

    let record: Record | undefined = this.records.find(it => {
      return it.token === token;
    });

    if (record) {
      return record;
    }

    if (isMultiProvider(provider)) {
      record = await this.resolveMultiProvider(provider);
    } else {
      record = await this.resolveRegularProvider(provider);
    }

    return this.records[this.records.push(record) - 1];
  }

  private async resolveMultiProvider(provider: Provider): Promise<Record> {
    const token: Token = getProviderToken(provider);
    const value: any[] = (await Promise.all(this.providers.filter(it => getProviderToken(it) === token).map(it => this.instantiateProvider(it)))).reverse();

    return {
      token: token,
      value: value,
    };
  }

  private async resolveRegularProvider(provider: Provider): Promise<Record> {
    return {
      token: getProviderToken(provider),
      value: await this.instantiateProvider(provider),
    };
  }

  private async instantiateProvider(provider: Provider): Promise<any> {
    if (isTypeProvider(provider) || isClassProvider(provider)) {
      const type: Type = isTypeProvider(provider) ? provider : provider.useClass;

      if (!hasInjectableMetadata(type)) {
        throw new RuntimeException(`The '${ type.name }' should be annotated as a injectable`);
      }
    }

    let instance: any;

    if (isTypeProvider(provider)) {
      instance = await this.instantiateTypeProvider(provider);
    } else if (isClassProvider(provider)) {
      instance = await this.instantiateClassProvider(provider);
    } else if (isExistingProvider(provider)) {
      instance = await this.instantiateExistingProvider(provider);
    } else if (isFactoryProvider(provider)) {
      instance = await this.instantiateFactoryProvider(provider);
    } else if (isValueProvider(provider)) {
      instance = await this.instantiateValueProvider(provider);
    } else {
      throw new RuntimeException(`Invalid provider '${ provider }'`);
    }

    return instance;
  }

  private async instantiateTypeProvider<T = any>(provider: TypeProvider<T>): Promise<any> {
    const dependencies: any[] = await this.resolveDependencies(provider);

    return new provider(...dependencies);
  }

  private async instantiateClassProvider<T = any>(provider: ClassProvider<T>): Promise<any> {
    const dependencies: any[] = await this.resolveDependencies(provider.useClass);

    return new provider.useClass(...dependencies);
  }

  private async instantiateExistingProvider<T = any>(provider: ExistingProvider<T>): Promise<any> {
    const existingProvider: Provider | undefined = this.getProviderByToken(provider.useExisting);

    if (existingProvider === undefined) {
      throw new RuntimeException(`No provider for ${ getTokenName(provider.useExisting) }!`);
    }

    return (await this.resolveProvider(existingProvider)).value;
  }

  private async instantiateFactoryProvider<T = any>(provider: FactoryProvider<T>): Promise<any> {
    const dependencies: any[] = await this.resolveDependencies(provider);

    return await provider.useFactory(...dependencies);
  }

  private async instantiateValueProvider<T = any>(provider: ValueProvider<T>): Promise<any> {
    return provider.useValue;
  }

  private async resolveDependencies(provider: TypeProvider | ClassProvider | FactoryProvider): Promise<any[]> {
    const dependencies: { optional: boolean, provider: Provider }[] = [];

    if (isTypeProvider(provider) || isClassProvider(provider)) {
      const type: Type = isTypeProvider(provider) ? provider : provider.useClass;
      const injectMetadata = getInjectMetadata(type);
      const optionalMetadata = getOptionalMetadata(type);

      for (const [index, value] of (Reflect.getMetadata('design:paramtypes', type) || []).entries()) {
        const injectParamType = (injectMetadata || []).find(it => it.index === index);

        if (value === undefined) {
          throw new RuntimeException(`Artisan can't resolve circular dependency`);
        }

        const token: Token = injectParamType ? (isForwardRef(injectParamType.inject) ? injectParamType.inject.forwardRef() : injectParamType.inject) : value;

        dependencies.push({
          optional: (optionalMetadata || []).some(it => it.index === index),
          provider: this.getProviderByToken(token),
        });
      }
    } else if (isFactoryProvider(provider)) {
      (provider.inject || []).forEach(token => {
        dependencies.push({
          optional: false,
          provider: this.getProviderByToken(token),
        });
      });
    }

    const resolvedDependencies: any[] = [];

    for (const [index, dependency] of dependencies.entries()) {
      if (dependency.provider === undefined && dependency.optional === false) {
        throw new RuntimeException(`Artisan can't resolve dependency at index [${ index }] in ${ getProviderName(provider) }`);
      }

      resolvedDependencies.push(dependency.provider && (await this.resolveProvider(dependency.provider)).value);
    }

    return resolvedDependencies;
  }

  private getProviderByToken(token: Token): Provider | undefined {
    return this.providers.find(it => getProviderToken(it) === token);
  }
}

export interface ApplicationOptions {
  providers: Provider[];
}

export interface Record {
  token: Token;
  value: any;
}
