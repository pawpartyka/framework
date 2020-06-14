import { Package, Provider } from '@artisanjs/core';
import { Config } from './services/config.service';

export class ConfigPackage {
  public static configure(): ConfigPackage {
    return new ConfigPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Config,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
