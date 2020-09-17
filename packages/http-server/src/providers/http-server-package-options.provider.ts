import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { HttpServerPackageOptions } from '../interfaces/http-server-package-options.interface';

export const HTTP_SERVER_PACKAGE_OPTIONS: Token = Symbol('http-server-package-options');

export function createHttpServerPackageOptionsProvider(provider: HttpServerPackageOptionsProvider): Provider {
  return {
    provide: HTTP_SERVER_PACKAGE_OPTIONS,
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export interface HttpServerPackageOptionsFactory {
  createHttpServerPackageOptions(): Promise<HttpServerPackageOptions> | HttpServerPackageOptions;
}

export type HttpServerPackageOptionsProvider =
  | Omit<ClassProvider<HttpServerPackageOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<HttpServerPackageOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<HttpServerPackageOptions>, 'provide' | 'multi'>;
