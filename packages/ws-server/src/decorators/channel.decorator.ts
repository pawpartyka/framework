import { Injectable, Type } from '@artisanjs/core';
import { Interceptor } from '../interfaces/interceptor.interface';

export const CHANNEL_METADATA = Symbol('artisanjs-ws-server:channel');

export function getChannelMetadata(target: object): ChannelMetadata | undefined {
  return Reflect.getMetadata(CHANNEL_METADATA, target);
}

export function hasChannelMetadata(target: object): boolean {
  return Reflect.hasMetadata(CHANNEL_METADATA, target);
}

export function Channel(path?: string, options?: ChannelOptions): ClassDecorator {
  return target => {
    const value: ChannelMetadata = {
      interceptors: options?.interceptors,
      path: path,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CHANNEL_METADATA, value, target);
  };
}

export interface ChannelMetadata extends ChannelOptions {
  path?: string;
}

export interface ChannelOptions {
  interceptors?: Type<Interceptor>[];
}
