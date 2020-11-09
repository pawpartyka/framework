import { ForwardRef, Token } from './utils';

export const INJECT_METADATA = Symbol('inject');
export const INJECTABLE_METADATA = Symbol('injectable');
export const OPTIONAL_METADATA = Symbol('optional');

export function getInjectMetadata(target: object): InjectMetadata | undefined {
  return Reflect.getMetadata(INJECT_METADATA, target);
}

export function getOptionalMetadata(target: object): OptionalMetadata | undefined {
  return Reflect.getMetadata(OPTIONAL_METADATA, target);
}

export function hasInjectableMetadata(target: object): boolean {
  return Reflect.hasMetadata(INJECTABLE_METADATA, target);
}

export function Inject(tokenOrForwardRef: Token | ForwardRef): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(INJECT_METADATA, (getInjectMetadata(target) || new Map()).set(parameterIndex, tokenOrForwardRef), target);
  };
}

export function Injectable(): ClassDecorator {
  return target => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
}

export function Optional(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(OPTIONAL_METADATA, (getOptionalMetadata(target) || new Map()).set(parameterIndex, true), target);
  };
}

export type InjectMetadata = Map<number, Token | ForwardRef>;

export type OptionalMetadata = Map<number, boolean>;
