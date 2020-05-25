import { Injectable, Type } from '@artisanjs/core';
import { Interceptor } from '../interfaces/interceptor.interface';

export const CONTROLLER_METADATA = Symbol('artisanjs-http-server:controller');

export function getControllerMetadata(target: object): ControllerMetadata | undefined {
  return Reflect.getMetadata(CONTROLLER_METADATA, target);
}

export function hasControllerMetadata(target: object): boolean {
  return Reflect.hasMetadata(CONTROLLER_METADATA, target);
}

export function Controller(prefix?: string, options?: ControllerOptions): ClassDecorator {
  return target => {
    const value: ControllerMetadata = {
      interceptors: options?.interceptors,
      prefix: prefix,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_METADATA, value, target);
  };
}

export interface ControllerMetadata extends ControllerOptions {
  prefix?: string;
}

export interface ControllerOptions {
  interceptors?: Type<Interceptor>[];
}
