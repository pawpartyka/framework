import { Package, Provider } from '@artisanjs/core';
import { Environment } from './services/environment';

export class EnvironmentPackage {
  public static configure(): EnvironmentPackage {
    return new EnvironmentPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Environment,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
