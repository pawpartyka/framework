import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { HttpServerManager } from './http-server.manager';
import { HttpServerPackageOptions } from './interfaces/http-server-package-options.interface';
import { createHttpRouterProvider } from './providers/http-router.provider';
import { createHttpRoutesProvider } from './providers/http-routes.provider';
import { createHttpServerPackageOptionsProvider, HttpServerPackageOptionsProvider } from './providers/http-server-package-options.provider';
import { createHttpServerProvider } from './providers/http-server.provider';

const BUILT_IN_MANAGERS: Provider[] = [
  HttpServerManager,
];

const BUILT_IN_PROVIDERS: Provider[] = [
  createHttpRouterProvider(),
  createHttpRoutesProvider(),
  createHttpServerProvider(),
];

export class HttpServerPackage {
  public static configure(options: HttpServerPackageOptions | HttpServerPackageOptionsProvider = {}): HttpServerPackage {
    return new HttpServerPackage(options);
  }

  private readonly providers: Provider[];

  protected constructor(options: HttpServerPackageOptions | HttpServerPackageOptionsProvider = {}) {
    this.providers = [
      ...BUILT_IN_MANAGERS,
      ...BUILT_IN_PROVIDERS,
    ];

    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createHttpServerPackageOptionsProvider(options));
    } else {
      this.providers.push(createHttpServerPackageOptionsProvider({ useFactory: () => options as HttpServerPackageOptions }));
    }
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
