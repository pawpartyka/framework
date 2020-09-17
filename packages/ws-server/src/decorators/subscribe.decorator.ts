import { Type } from '@artisanjs/core';

export const SUBSCRIBE_METADATA = Symbol('artisanjs-ws-server:subscribe');

export function getSubscribeMetadata(target: object): SubscribeMetadata[] | undefined {
  return Reflect.getMetadata(SUBSCRIBE_METADATA, target);
}

export function hasSubscribeMetadata(target: object): boolean {
  return Reflect.hasMetadata(SUBSCRIBE_METADATA, target);
}

export function Subscribe(event: string, options: SubscribeOptions = {}): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const value: SubscribeMetadata[] = [...(getSubscribeMetadata(target.constructor) || []), {
      descriptor: descriptor,
      event: event,
    }];

    Reflect.defineMetadata(SUBSCRIBE_METADATA, value, target.constructor);
  };
}

export interface SubscribeMetadata extends SubscribeOptions {
  descriptor: TypedPropertyDescriptor<any>;
  event: string;
}

export interface SubscribeOptions {
  interceptors?: Type<any>[];
}
