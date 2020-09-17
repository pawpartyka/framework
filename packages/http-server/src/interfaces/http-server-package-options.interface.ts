import { Type } from '@artisanjs/core';
import http from 'http';
import tls from 'tls';
import { Interceptor } from './interceptor.interface';

export interface HttpServerPackageOptions extends tls.SecureContextOptions, tls.TlsOptions, http.ServerOptions {
  interceptors?: Type<Interceptor>[];
  port?: number;
}
