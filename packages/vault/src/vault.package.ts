import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { VaultOptions } from './interfaces/vault-options.interface';
import { createVaultOptionsProvider, VaultOptionsProvider } from './providers/vault-options.provider';
import { createVaultProvider } from './providers/vault.provider';

export class VaultPackage {
  public static configure(): VaultPackage {
    return new VaultPackage();
  }

  private readonly providers: Provider[];

  constructor() {
    this.providers = [];
  }

  public declareVault(name: string, options: VaultOptions | VaultOptionsProvider): VaultPackage {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createVaultOptionsProvider(name, options));
    } else {
      this.providers.push(createVaultOptionsProvider(name, { useFactory: () => options as VaultOptions }));
    }

    this.providers.push(createVaultProvider(name));

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
