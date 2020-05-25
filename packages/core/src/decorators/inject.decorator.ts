import { ForwardRef } from '../interfaces/forward-ref.interface';
import { Token } from '../interfaces/token.interface';

export const INJECT_METADATA = Symbol('artisanjs-core:inject');

export function getInjectMetadata(target: object): InjectMetadata[] | undefined {
  return Reflect.getMetadata(INJECT_METADATA, target);
}

export function hasInjectMetadata(target: object): boolean {
  return Reflect.hasMetadata(INJECT_METADATA, target);
}

export function Inject(token: Token | ForwardRef): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const value: InjectMetadata[] = [...getInjectMetadata(target) || [], { index: parameterIndex, inject: token }];

    Reflect.defineMetadata(INJECT_METADATA, value, target);
  };
}

export interface InjectMetadata {
  index: number;
  inject: Token | ForwardRef;
}
