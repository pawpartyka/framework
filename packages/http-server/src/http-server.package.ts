import { Package, Provider, Type } from '@artisanjs/core';
import * as http from 'http';
import * as tls from 'tls';
import { HttpServerManager } from './http-server.manager';
import { Interceptor } from './interfaces/interceptor.interface';
import { createHttpRouterProvider } from './providers/http-router.provider';
import { createHttpRoutesProvider } from './providers/http-routes.provider';
import { createHttpServerProvider } from './providers/http-server.provider';
import { HTTP_INTERCEPTOR } from './tokens/http-interceptor.token';

export class HttpServerPackage {
  public static configure(options: HttpServerPackageOptions = {}): HttpServerPackage {
    return new HttpServerPackage(options);
  }

  private readonly providers: Provider[];

  protected constructor(options: HttpServerPackageOptions = {}) {
    this.providers = [
      HttpServerManager,

      createHttpRouterProvider(),
      createHttpRoutesProvider(),
      createHttpServerProvider(),
    ];

    for (const interceptor of options?.interceptors || []) {
      this.providers.push({
        provide: HTTP_INTERCEPTOR,
        useClass: interceptor,
        multi: true,
      });
    }
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}

export interface HttpServerPackageOptions extends tls.SecureContextOptions, tls.TlsOptions, http.ServerOptions {
  interceptors?: Type<Interceptor>[];
}
