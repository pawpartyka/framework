import { getInjectMetadata, getOptionalMetadata, hasInjectableMetadata } from './metadata';

export function forwardRef(fn: () => Token): ForwardRef {
  return { forwardRef: fn };
}

export function getProviderDependencies(provider: ClassProvider | FactoryProvider | TypeProvider): Dependency[] {
  const dependencies: Dependency[] = [];

  if (isClassProvider(provider) || isTypeProvider(provider)) {
    const type: Type = isTypeProvider(provider) ? provider : provider.useClass;

    if (hasInjectableMetadata(type) === false) {
      throw new Error(`The '${ type.name }' should be annotated as a injectable`);
    }

    const injectMetadata = getInjectMetadata(type);
    const optionalMetadata = getOptionalMetadata(type);

    for (const [index, value] of (Reflect.getMetadata('design:paramtypes', type) || []).entries()) {
      if (value === undefined) {
        throw new Error(`Artisan can't resolve circular dependency`);
      }

      const injectType = injectMetadata?.get(index);

      dependencies.push({
        dependency: injectType ? (isForwardRef(injectType) ? injectType.forwardRef() : injectType) : value,
        optional: optionalMetadata?.has(index),
      });
    }
  } else if (isFactoryProvider(provider)) {
    for (const it of provider.dependencies || []) {
      dependencies.push(typeof it === 'object' ? it : { dependency: it, optional: false });
    }
  }

  return dependencies;
}

export function getProviderName(provider: Provider): string {
  return getTokenName(getProviderToken(provider));
}

export function getProviderToken(provider: Provider): Token {
  return isTypeProvider(provider) ? provider : provider.provide;
}

export function getTokenName(token: Token): string {
  return isTypeProvider(token) ? token.name : token.toString();
}

export function isClassProvider(provider: any): provider is ClassProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useClass');
}

export function isExistingProvider(provider: any): provider is ExistingProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useExisting');
}

export function isFactoryProvider(provider: any): provider is FactoryProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useFactory');
}

export function isForwardRef(value: any): value is ForwardRef {
  return value !== null && typeof value === 'object' && value.hasOwnProperty('forwardRef');
}

export function isMultiProvider(provider: any): provider is MultiProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('multi');
}

export function isTypeProvider(provider: any): provider is TypeProvider {
  return typeof provider === 'function';
}

export function isValueProvider(provider: any): provider is ValueProvider {
  return provider !== null && typeof provider === 'object' && provider.hasOwnProperty('useValue');
}

export interface BeforeApplicationShutdown {
  beforeApplicationShutdown(signal: string): void | Promise<void>;
}

export interface ClassProvider<T = any> extends MultiProvider {
  provide: Token;
  useClass: Type<T>;
}

export interface Dependency {
  dependency: Token;
  optional: boolean;
}

export interface ExistingProvider<T = any> extends MultiProvider {
  provide: Token;
  useExisting: Token<T>;
}

export interface FactoryProvider<T = any> extends MultiProvider {
  dependencies?: (Token | Dependency)[];
  provide: Token;
  useFactory: (...deps: any[]) => T;
}

export interface ForwardRef<T = any> {
  forwardRef: () => Token<T>;
}

export interface MultiProvider {
  multi?: boolean;
}

export interface OnApplicationBoot {
  onApplicationBoot(): void | Promise<void>;
}

export interface OnApplicationInit {
  onApplicationInit(): void | Promise<void>;
}

export interface OnApplicationListen {
  onApplicationListen(): void | Promise<void>;
}

export interface OnApplicationShutdown {
  onApplicationShutdown(signal: string): void | Promise<void>;
}

export interface Type<T = any> {
  new(...args: any): T;
}

export interface TypeProvider<T = any> {
  new(...args: any): T;
}

export interface ValueProvider<T = any> extends MultiProvider {
  provide: Token;
  useValue: T;
}

export type Provider<T = any> =
  ClassProvider<T>
  | ExistingProvider<T>
  | FactoryProvider<T>
  | TypeProvider<T>
  | ValueProvider<T>;

export type Token<T = any> =
  string
  | symbol
  | Type<T>;
