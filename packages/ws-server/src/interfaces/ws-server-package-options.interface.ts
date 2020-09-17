import { Type } from '@artisanjs/core';
import { Interceptor } from './interceptor.interface';

export interface WsServerPackageOptions {
  interceptors?: Type<Interceptor>[];
  path?: string;
  port?: number;
}
