import { Package, Provider } from '@artisanjs/core';

export class HttpServerPackage {
  public static configure(): HttpServerPackage {
    return new HttpServerPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
