import { Package, Provider } from '@artisanjs/core';

export class VaultPackage {
  public static configure(): VaultPackage {
    return new VaultPackage();
  }

  private readonly providers: Provider[];

  constructor() {
    this.providers = [];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
