import { Path } from '../../types/path';
import { Method } from '../../types/method';

export const REQUEST_MAPPING_METADATA = Symbol('REQUEST_MAPPING_METADATA');

export function RequestMapping(options: RequestMappingOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const meta: RequestMappingMetadata = Reflect.getMetadata(REQUEST_MAPPING_METADATA, descriptor.value) || [];

    meta.push(options);

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA, meta, descriptor.value);
  };
}

export function Delete(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'DELETE' });
}

export function Get(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'GET' });
}

export function Head(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'HEAD' });
}

export function Options(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'OPTIONS' });
}

export function Patch(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'PATCH' });
}

export function Post(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'POST' });
}

export function Put(path?: string): MethodDecorator {
  return RequestMapping({ path: path, method: 'PUT' });
}

export interface RequestMappingOptions {
  path?: Path;
  method: Method;
}

export type RequestMappingMetadata = Array<RequestMappingOptions>;
