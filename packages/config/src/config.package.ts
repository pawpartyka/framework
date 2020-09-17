import { Package, Provider } from '@artisanjs/core';
import { Config } from './services/config.service';

const BUILT_IN_SERVICES: Provider[] = [
  Config,
];

export class ConfigPackage {
  public static configure(): ConfigPackage {
    return new ConfigPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      ...BUILT_IN_SERVICES,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
