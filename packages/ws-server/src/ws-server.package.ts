import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { WsServerPackageOptions } from './interfaces/ws-server-package-options.interface';
import { createWsServerPackageOptionsProvider, WsServerPackageOptionsProvider } from './providers/ws-server-package-options.provider';
import { Emitter } from './services/emitter.service';
import { WsServerManager } from './ws-server.manager';

const BUILT_IN_MANAGERS: Provider[] = [
  WsServerManager,
];

const BUILT_IN_SERVICES: Provider[] = [
  Emitter,
];

export class WsServerPackage {
  public static configure(options: WsServerPackageOptions | WsServerPackageOptionsProvider = {}): WsServerPackage {
    return new WsServerPackage(options);
  }

  private readonly providers: Provider[];

  protected constructor(options: WsServerPackageOptions | WsServerPackageOptionsProvider = {}) {
    this.providers = [
      ...BUILT_IN_MANAGERS,
      ...BUILT_IN_SERVICES,
    ];

    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createWsServerPackageOptionsProvider(options));
    } else {
      this.providers.push(createWsServerPackageOptionsProvider({ useFactory: () => options as WsServerPackageOptions }));
    }
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
