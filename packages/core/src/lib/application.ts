import {
  BeforeApplicationShutdown,
  ClassProvider,
  FactoryProvider,
  getProviderDependencies,
  getProviderName,
  getProviderToken,
  getTokenName,
  isClassProvider,
  isExistingProvider,
  isFactoryProvider,
  isMultiProvider,
  isTypeProvider,
  isValueProvider,
  OnApplicationBoot,
  OnApplicationInit,
  OnApplicationListen,
  OnApplicationShutdown,
  Provider,
  Token,
  TypeProvider,
} from './utils';
import { Logger } from './logger';

export const APPLICATION_REF: Token = Symbol('app-ref');

export class Application {
  public static async create(options: ApplicationOptions): Promise<Application> {
    const application: Application = await new Application(options.providers).init();

    (await application.find(Logger)).info('Starting application...');

    await application.registerShutdownHooks([]);
    await application.callOnApplicationBootHooks();
    await application.callOnApplicationInitHooks();
    await application.callOnApplicationListenHooks();

    return application;
  }

  protected readonly providers: Provider[];
  protected readonly resolvedProviders: ResolvedProvider[] = [];

  protected constructor(providers: Provider[]) {
    const BUILT_IN_SERVICES: Provider[] = [
      Logger,
    ];

    this.providers = [
      { provide: APPLICATION_REF, useValue: this },
      ...BUILT_IN_SERVICES,
      ...providers,
    ];
  }

  public async filter(fn: (token: Token) => boolean): Promise<any[]> {
    const resolvedProviders: ResolvedProvider[] = [];

    for (const provider of this.providers.filter(it => fn(getProviderToken(it)))) {
      resolvedProviders.push(await this.resolveProvider(provider));
    }

    return resolvedProviders.map(it => it.value);
  }

  public async find<T>(token: Token<T>, defaultValue?: any): Promise<T> {
    const provider: Provider = this.providers.find(it => getProviderToken(it) === token);

    if (provider === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Provider '${ getTokenName(token) }' not found`);
      }

      return defaultValue;
    }

    return (await this.resolveProvider(provider)).value;
  }

  private async callOnApplicationBootHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if (typeof (provider as OnApplicationBoot).onApplicationBoot === 'function') {
        await provider.onApplicationBoot();
      }
    }
  }

  private async callOnApplicationInitHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if (typeof (provider as OnApplicationInit).onApplicationInit === 'function') {
        await provider.onApplicationInit();
      }
    }
  }

  private async callOnApplicationListenHooks(): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if (typeof (provider as OnApplicationListen).onApplicationListen === 'function') {
        await provider.onApplicationListen();
      }
    }
  }

  private async callBeforeApplicationShutdownHooks(signal: string): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if (typeof (provider as BeforeApplicationShutdown).beforeApplicationShutdown === 'function') {
        await provider.beforeApplicationShutdown(signal);
      }
    }
  }

  private async callOnApplicationShutdownHooks(signal: string): Promise<void> {
    for (const provider of await this.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if (typeof (provider as OnApplicationShutdown).onApplicationShutdown === 'function') {
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

  private async init(): Promise<Application> {
    for (const provider of new Set(this.providers.filter(it => isMultiProvider(it))).values()) {
      if (new Set(this.providers.filter(it => getProviderToken(it) === getProviderToken(provider)).map(it => (it as any).multi)).size >= 2) {
        throw new Error(`Mixing multi and regular providers is not possible for token ${ getProviderName(provider) }`);
      }
    }

    for (const provider of this.providers) {
      await this.resolveProvider(provider);
    }

    return this;
  }

  private async resolveProvider(provider: Provider): Promise<ResolvedProvider> {
    const token: Token = getProviderToken(provider);

    let resolvedProvider: ResolvedProvider | undefined = this.resolvedProviders.find(it => {
      return it.provide === token;
    });

    if (resolvedProvider) {
      return resolvedProvider;
    }

    if (isMultiProvider(provider)) {
      resolvedProvider = {
        provide: token,
        value: await Promise.all(
          this.providers.filter(it => getProviderToken(it) === token).map(it => this.instantiateProvider(it)),
        ),
      };
    } else {
      resolvedProvider = {
        provide: getProviderToken(provider),
        value: await this.instantiateProvider(provider),
      };
    }

    return this.resolvedProviders[this.resolvedProviders.push(resolvedProvider) - 1];
  }

  private async instantiateProvider(provider: Provider): Promise<any> {
    let instance: any;

    if (isClassProvider(provider)) {
      const dependencies: any[] = await this.resolveDependencies(provider.useClass);

      instance = new provider.useClass(...dependencies);
    } else if (isExistingProvider(provider)) {
      const existingProvider: Provider | undefined = this.providers.find(it => {
        return getProviderToken(it) === provider.useExisting;
      });

      if (existingProvider === undefined) {
        throw new Error(`No provider for ${ getProviderName(provider) }!`);
      }

      instance = (await this.resolveProvider(existingProvider)).value;
    } else if (isFactoryProvider(provider)) {
      const dependencies: any[] = await this.resolveDependencies(provider);

      instance = await provider.useFactory(...dependencies);
    } else if (isTypeProvider(provider)) {
      const dependencies: any[] = await this.resolveDependencies(provider);

      instance = new provider(...dependencies);
    } else if (isValueProvider(provider)) {
      instance = provider.useValue;
    } else {
      throw new Error(`Invalid provider '${ provider }'`);
    }

    return instance;
  }

  private async resolveDependencies(provider: ClassProvider | FactoryProvider | TypeProvider): Promise<any[]> {
    const dependencies: any[] = [];

    for (const [index, dependency] of getProviderDependencies(provider).entries()) {
      const provider: Provider = this.providers.find(it => {
        return getProviderToken(it) === dependency.dependency;
      });

      if (provider === undefined && dependency.optional === false) {
        throw new Error(`Artisan can't resolve dependency at index [${ index }] in ${ getProviderName(provider) }`);
      }

      dependencies.push(provider && (await this.resolveProvider(provider)).value);
    }

    return dependencies;
  }
}

export interface ApplicationOptions {
  providers: Provider[];
}

export interface ResolvedProvider {
  provide: Token;
  value: any;
}
