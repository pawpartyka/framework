import { Package, Provider } from '@artisanjs/core';
import { RabbitManager } from './rabbit-manager';

export class RabbitPackage {
  public static configure(): RabbitPackage {
    return new RabbitPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      RabbitManager,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
