import { Injectable } from '../../decorators/injectable';

export const CONTROLLER_METADATA = Symbol('CONTROLLER_METADATA');

export function Controller(prefix?: string): ClassDecorator {
  return target => {
    const meta: ControllerMetadata = {
      ...Reflect.getMetadata(CONTROLLER_METADATA, target) || {},
      prefix: prefix,
    };

    Reflect.decorate([Injectable()], target);
    Reflect.defineMetadata(CONTROLLER_METADATA, meta, target);
  };
}

export type ControllerMetadata = { prefix?: string };
