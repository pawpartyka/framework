import { Package, Provider } from '@artisanjs/core';

export class OrmPackage {
  public static configure(): OrmPackage {
    return new OrmPackage();
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
