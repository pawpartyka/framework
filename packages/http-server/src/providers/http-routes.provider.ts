import { HttpMethod } from '@artisanjs/common';
import { Injector, Provider, Token } from '@artisanjs/core';
import * as mime from 'mime-types';
import { getControllerMetadata, hasControllerMetadata, ControllerMetadata } from '../decorators/controller.decorator';
import { getRequestMappingMetadata } from '../decorators/request-mapping.decorator';
import { getRequestParamMetadata, Factory } from '../decorators/request-param.decorator';
import { HttpServerPackageOptions } from '../interfaces/http-server-package-options.interface';
import { Interceptor } from '../interfaces/interceptor.interface';
import { Next } from '../interfaces/next.interface';
import { Request } from '../interfaces/request.interface';
import { Response } from '../interfaces/response.interface';
import { HTTP_SERVER_PACKAGE_OPTIONS } from './http-server-package-options.provider';

export const HTTP_ROUTES: Token = Symbol('http-routes');

export function composeHttpRouteHandler(interceptors: ((req: Request, res: Response, next: Next) => any)[]): HttpRouteHandler {
  return async (request: Request, response: Response): Promise<void> => {
    async function dispatch(index: number): Promise<void> {
      const interceptor = interceptors[index];

      if (!interceptor) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(interceptor(request, response, dispatch.bind(null, index + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return dispatch(0);
  };
}

export function createHttpRoutesProvider(): Provider {
  return {
    provide: HTTP_ROUTES,
    useFactory: async (httpServerPackageOptions: HttpServerPackageOptions, injector: Injector): Promise<HttpRoute[]> => {
      const httpInterceptors: Interceptor[] = await Promise.all((httpServerPackageOptions.interceptors || []).map(it => injector.find(it)));
      const httpRoutes: HttpRoute[] = [];

      for (const controller of await injector.filter(it => hasControllerMetadata(it))) {
        const controllerMetadata: ControllerMetadata = getControllerMetadata(controller.constructor) || {};
        const controllerInterceptors: Interceptor[] = await Promise.all((controllerMetadata.interceptors || []).map(it => injector.find(it)));

        for (const requestMappingMetadata of getRequestMappingMetadata(controller.constructor) || []) {
          const routeInterceptors: Interceptor[] = await Promise.all((requestMappingMetadata.interceptors || []).map(it => injector.find(it)));
          const routeParams: Factory[] = (getRequestParamMetadata(controller, requestMappingMetadata.descriptor.value.name) || [])
            .sort((a, b) => (a.index > b.index) ? 1 : -1)
            .map(it => it.factory);

          httpRoutes.push({
            handler: composeHttpRouteHandler([
              /* INTERCEPTORS */
              ...[...httpInterceptors, ...controllerInterceptors, ...routeInterceptors].map(it => it.intercept.bind(it)),

              /* ROUTE HANDLER */
              async (request: Request, response: Response, next: Next) => {
                const result = await requestMappingMetadata.descriptor.value.apply(controller, await Promise.all(routeParams.map(it => it(request, response))));

                if (response.writableEnded === false) {
                  let data: any;

                  if (result && response.hasHeader('Content-Type') === false) {
                    let contentType: string | false;

                    if (typeof result === 'string') {
                      data = result;
                      contentType = mime.contentType(/^\s*</.test(result) ? 'html' : 'text');
                    } else if (Buffer.isBuffer(result)) {
                      data = result;
                      contentType = mime.contentType('bin');
                    } else if (typeof result.pipe === 'function') {
                      data = result;
                      contentType = mime.contentType('bin');
                    } else {
                      data = JSON.stringify(result);
                      contentType = mime.contentType('json');
                    }

                    if (contentType) {
                      response.setHeader('Content-Type', contentType);
                    }
                  }

                  response.end(data);
                }

                return next();
              },
            ]),
            method: requestMappingMetadata.method,
            path: `${ controllerMetadata.prefix || '' }${ requestMappingMetadata.path || '' }`,
          });
        }
      }

      return httpRoutes;
    },
    inject: [HTTP_SERVER_PACKAGE_OPTIONS, Injector],
  };
}

export interface HttpRoute {
  handler: HttpRouteHandler;
  method: HttpMethod;
  path: string;
}

export interface HttpRouteHandler {
  (request: Request, response: Response): void | Promise<void>;
}
