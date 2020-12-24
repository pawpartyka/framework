import { ClassProvider, FactoryProvider, Provider, TypeProvider } from './types/provider';
import { getProviderToken } from './utils/get-provider-token';
import { getProviderName } from './utils/get-provider-name';
import { Token } from './types/token';
import { isClassProvider } from './utils/is-class-provider';
import { isExistingProvider } from './utils/is-existing-provider';
import { isFactoryProvider } from './utils/is-factory-provider';
import { isTypeProvider } from './utils/is-type-provider';
import { isValueProvider } from './utils/is-value-provider';
import { Type } from './types/type';
import { INJECTABLE_METADATA } from './decorators/injectable';
import { INJECT_METADATA, InjectMetadata } from './decorators/inject';
import { OPTIONAL_METADATA, OptionalMetadata } from './decorators/optional';
import { isForwardRef } from './utils/forward-ref';
import { getTokenName } from './utils/get-token-name';

export class Injector {
  public static async create(providers: Provider[]): Promise<Injector> {
    return await new Injector([...providers]).init();
  }

  protected readonly resolvedProviders: ResolvedProvider[] = [];

  constructor(private readonly providers: Provider[]) {
    this.providers.unshift({ provide: Injector, useValue: this });
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

  private async init(): Promise<Injector> {
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

    resolvedProvider = {
      provide: token,
      value: await this.instantiateProvider(provider),
    };

    return this.resolvedProviders[this.resolvedProviders.push(resolvedProvider) - 1];
  }

  private async instantiateProvider(provider: Provider): Promise<any> {
    let instance: any;

    if (isClassProvider(provider)) {
      const dependencies: any[] = await this.resolveDependencies(provider.useClass);

      instance = new provider.useClass(...dependencies);
    } else if (isExistingProvider(provider)) {
      if (provider.provide === provider.useExisting) {
        throw new Error(`Cannot instantiate cyclic dependency for token ${ getProviderName(provider) }!`);
      }

      const existingProvider: Provider | undefined = this.providers.find(it => {
        return getProviderToken(it) === provider.useExisting;
      });

      if (existingProvider === undefined) {
        throw new Error(`No provider for ${ getTokenName(provider.useExisting) }!`);
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
    const dependencies: { dependency: Token; optional: boolean; }[] = [];

    if (isClassProvider(provider) || isTypeProvider(provider)) {
      const type: Type = isTypeProvider(provider) ? provider : provider.useClass;

      if (Reflect.hasMetadata(INJECTABLE_METADATA, type) === false) {
        throw new Error(`The '${ type.name }' should be annotated as a injectable`);
      }

      const injectMetadata: InjectMetadata = Reflect.getMetadata(INJECT_METADATA, type);
      const optionalMetadata: OptionalMetadata = Reflect.getMetadata(OPTIONAL_METADATA, type);

      for (const [index, value] of (Reflect.getMetadata('design:paramtypes', type) || []).entries()) {
        if (value === undefined) {
          throw new Error(`Artisan can't resolve circular dependency`);
        }

        const injectType = injectMetadata?.get(index);

        dependencies.push({
          dependency: injectType ? (isForwardRef(injectType) ? injectType.forwardRef() : injectType) : value,
          optional: optionalMetadata?.has(index) || false,
        });
      }
    } else if (isFactoryProvider(provider)) {
      for (const it of provider.dependencies || []) {
        dependencies.push(typeof it === 'object' ? it : { dependency: it, optional: false });
      }
    }

    return await Promise.all(dependencies.map(async (dependency, index) => {
      const dep: Provider = this.providers.find(it => {
        return getProviderToken(it) === dependency.dependency;
      });

      if (dep === undefined && dependency.optional === false) {
        throw new Error(`Artisan can't resolve dependency at index [${ index }] in ${ getProviderName(provider) }`);
      }

      return dep && (await this.resolveProvider(dep)).value;
    }));
  }
}

export interface ResolvedProvider {
  provide: Token;
  value: any;
}
