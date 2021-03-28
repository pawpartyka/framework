import { Package, Provider } from '@artisanjs/core';

export class HttpClientPackage {
  public static configure(): HttpClientPackage {
    return new HttpClientPackage();
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
