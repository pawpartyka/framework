import { Request } from '../interfaces/request.interface';
import { Response } from '../interfaces/response.interface';

export const REQUEST_PARAM_METADATA = Symbol('artisanjs-http-server:request-param');

export function getRequestParamMetadata(target: object, propertyKey: string | symbol): RequestParamMetadata[] | undefined {
  return Reflect.getMetadata(REQUEST_PARAM_METADATA, target, propertyKey);
}

export function hasRequestParamMetadata(target: object, propertyKey: string | symbol): boolean {
  return Reflect.hasMetadata(REQUEST_PARAM_METADATA, target, propertyKey);
}

export function RequestParam(factory: Factory): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const value: RequestParamMetadata[] = [...(getRequestParamMetadata(target, propertyKey) || []), {
      factory: factory,
      index: parameterIndex,
    }];

    Reflect.defineMetadata(REQUEST_PARAM_METADATA, value, target, propertyKey);
  };
}

export function Body(property?: string): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return property ? request.body[property] : request.body;
  });
}

export function Headers(property?: string): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return property ? request.headers[property] : request.headers;
  });
}

export function Params(property?: string): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return property ? request.params[property] : request.params;
  });
}

export function Query(property?: string): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return property ? request.query[property] : request.query;
  });
}

export function Req(): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return request;
  });
}

export function Res(): ParameterDecorator {
  return RequestParam((request: Request, response: Response) => {
    return response;
  });
}

export interface Factory {
  (request: Request, response: Response): any;
}

export interface RequestParamMetadata {
  factory: Factory;
  index: number;
}
