import { HttpMethod } from '@artisanjs/common';

export interface RequestOptions {
  body?: any;
  compression?: boolean;
  headers?: { [header: string]: string; };
  method: HttpMethod;
  params?: { [param: string]: string; };
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string;
}
