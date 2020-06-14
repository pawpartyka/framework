import { Provider, Token } from '@artisanjs/core';
import fmw from 'find-my-way';
import { Instance as HttpRouter } from 'find-my-way';

export const HTTP_ROUTER: Token = Symbol('http-router');

export function createHttpRouterProvider(): Provider {
  return {
    provide: HTTP_ROUTER,
    useFactory: (): HttpRouter<any> => {
      return fmw();
    },
  };
}
