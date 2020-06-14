import { Package, Provider } from '@artisanjs/core';
import { ConfigService } from './services/config.service';

export class ConfigPackage {
  public static configure(): ConfigPackage {
    return new ConfigPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      ConfigService,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
