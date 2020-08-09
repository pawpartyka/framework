export const ON_EVENT_METADATA = Symbol('artisanjs-events:on-event');

export function getOnEventMetadata(target: object): OnEventMetadata[] | undefined {
  return Reflect.getMetadata(ON_EVENT_METADATA, target);
}

export function hasOnEventMetadata(target: object): boolean {
  return Reflect.hasMetadata(ON_EVENT_METADATA, target);
}

export function OnEvent(event: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: OnEventMetadata[] = [...(getOnEventMetadata(target.constructor) || []), {
      descriptor: descriptor,
      event: event,
    }];

    Reflect.defineMetadata(ON_EVENT_METADATA, value, target.constructor);
  };
}

export interface OnEventMetadata {
  descriptor: TypedPropertyDescriptor<any>;
  event: string;
}
