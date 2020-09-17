import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { WsServerPackageOptions } from '../interfaces/ws-server-package-options.interface';

export const WS_SERVER_PACKAGE_OPTIONS: Token = Symbol('ws-server-package-options');

export function createWsServerPackageOptionsProvider(provider: WsServerPackageOptionsProvider): Provider {
  return {
    provide: WS_SERVER_PACKAGE_OPTIONS,
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export interface WsServerPackageOptionsFactory {
  createWsServerPackageOptions(): Promise<WsServerPackageOptions> | WsServerPackageOptions;
}

export type WsServerPackageOptionsProvider =
  | Omit<ClassProvider<WsServerPackageOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<WsServerPackageOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<WsServerPackageOptions>, 'provide' | 'multi'>;
