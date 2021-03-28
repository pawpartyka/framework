import { Package, Provider } from '@artisanjs/core';

export class HttpGatewayPackage {
  public static configure(): HttpGatewayPackage {
    return new HttpGatewayPackage();
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
