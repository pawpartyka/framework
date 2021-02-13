export const ON_EVENT_METADATA = Symbol('ON_EVENT_METADATA');

export function OnEvent(event: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const meta: OnEventMetadata = Reflect.getMetadata(ON_EVENT_METADATA, descriptor.value) || [];

    meta.push({ event: event });

    Reflect.defineMetadata(ON_EVENT_METADATA, meta, descriptor.value);
  };
}

export type OnEventMetadata = Array<{ event: string }>;
