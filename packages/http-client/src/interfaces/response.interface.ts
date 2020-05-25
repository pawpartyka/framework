import { HttpStatus } from '@artisanjs/common';
import { RequestOptions } from './request-options.interface';

export interface Response<T = any> {
  data: T;
  status: HttpStatus;
  statusText: string;
  headers: any;
  options: RequestOptions;
  request?: any;
}
