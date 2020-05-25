import { HttpMethod } from '@artisanjs/common';
import { Type } from '@artisanjs/core';
import { Interceptor } from '../interfaces/interceptor.interface';

export const REQUEST_MAPPING_METADATA = Symbol('artisanjs-http-server:request-mapping');

export function getRequestMappingMetadata(target: object): RequestMappingMetadata[] | undefined {
  return Reflect.getMetadata(REQUEST_MAPPING_METADATA, target);
}

export function hasRequestMappingMetadata(target: object): boolean {
  return Reflect.hasMetadata(REQUEST_MAPPING_METADATA, target);
}

export function RequestMapping(options: RequestMappingOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const value: RequestMappingMetadata[] = [...(getRequestMappingMetadata(target.constructor) || []), {
      descriptor: descriptor,
      interceptors: options.interceptors,
      path: options.path,
      method: options.method,
    }];

    Reflect.defineMetadata(REQUEST_MAPPING_METADATA, value, target.constructor);
  };
}

export function All(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.ALL });
}

export function Delete(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.DELETE });
}

export function Get(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.GET });
}

export function Head(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.HEAD });
}

export function Options(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.OPTIONS });
}

export function Patch(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.PATCH });
}

export function Post(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.POST });
}

export function Put(path?: string, options?: Omit<RequestMappingOptions, 'path' | 'method'>): MethodDecorator {
  return RequestMapping({ ...options, path: path, method: HttpMethod.PUT });
}

export interface RequestMappingMetadata extends RequestMappingOptions {
  descriptor: TypedPropertyDescriptor<any>;
}

export interface RequestMappingOptions {
  interceptors?: Type<Interceptor>[];
  path?: string;
  method: HttpMethod;
}
