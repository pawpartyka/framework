import { Provider, Token } from '@artisanjs/core';
import { Instance as HttpRouter } from 'find-my-way';
import * as http from 'http';
import * as https from 'https';
import { HTTP_ROUTER } from './http-router.provider';

export const HTTP_SERVER: Token = Symbol('http-server');

export function createHttpServerProvider(): Provider {
  return {
    provide: HTTP_SERVER,
    useFactory: (httpRouter: HttpRouter<any>): http.Server | https.Server => {
      return http.createServer((request, response) => httpRouter.lookup(request, response));
    },
    inject: [HTTP_ROUTER],
  };
}
