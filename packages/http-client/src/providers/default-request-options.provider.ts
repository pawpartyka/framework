import { Provider, Token } from '@artisanjs/core';
import { RequestOptions } from '../interfaces/request-options.interface';

export const DEFAULT_REQUEST_OPTIONS: Token = Symbol('artisanjs-http-client:default-request-options');

export function createDefaultRequestOptionsProvider(): Provider {
  return {
    provide: DEFAULT_REQUEST_OPTIONS,
    useFactory: (): DefaultRequestOptions => {
      return {
        compression: false,
        headers: null,
        responseType: 'json',
        timeout: null,
      };
    },
  };
}

export interface DefaultRequestOptions extends Pick<RequestOptions, 'compression' | 'headers' | 'responseType' | 'timeout'> {
}
