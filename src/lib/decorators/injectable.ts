export const INJECTABLE_METADATA = Symbol('INJECTABLE_METADATA');

export function Injectable(): ClassDecorator {
  return target => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
  };
}
