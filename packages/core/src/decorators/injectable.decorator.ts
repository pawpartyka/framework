export const INJECTABLE_METADATA = Symbol('artisanjs-core:injectable');

export function getInjectableMetadata(target: object): boolean | undefined {
  return Reflect.getMetadata(INJECTABLE_METADATA, target);
}

export function hasInjectableMetadata(target: object): boolean {
  return Reflect.hasMetadata(INJECTABLE_METADATA, target);
}

export function Injectable(): ClassDecorator {
  return target => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
}
