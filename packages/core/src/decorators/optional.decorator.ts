export const OPTIONAL_METADATA = Symbol('artisanjs-core:optional');

export function getOptionalMetadata(target: object): OptionalMetadata[] | undefined {
  return Reflect.getMetadata(OPTIONAL_METADATA, target);
}

export function hasOptionalMetadata(target: object): boolean {
  return Reflect.hasMetadata(OPTIONAL_METADATA, target);
}

export function Optional(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const value: OptionalMetadata[] = [...getOptionalMetadata(target) || [], { index: parameterIndex }];

    Reflect.defineMetadata(OPTIONAL_METADATA, value, target);
  };
}

export interface OptionalMetadata {
  index: number;
}
