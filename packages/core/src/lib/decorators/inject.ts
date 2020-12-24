import { Token } from '../types/token';
import { ForwardRef } from '../utils/forward-ref';

export const INJECT_METADATA = Symbol('INJECT');

export function Inject(tokenOrForwardRef: Token | ForwardRef): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const meta: InjectMetadata = (Reflect.getMetadata(INJECT_METADATA, target) || new Map());

    meta.set(parameterIndex, tokenOrForwardRef);

    Reflect.defineMetadata(INJECT_METADATA, meta, target);
  };
}

export type InjectMetadata = Map<number, Token | ForwardRef>;
