export const OPTIONAL_METADATA = Symbol('OPTIONAL_METADATA');

export function Optional(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const meta: OptionalMetadata = (Reflect.getMetadata(OPTIONAL_METADATA, target) || new Map());

    meta.set(parameterIndex, true);

    Reflect.defineMetadata(OPTIONAL_METADATA, meta, target);
  };
}

export type OptionalMetadata = Map<number, boolean>;
