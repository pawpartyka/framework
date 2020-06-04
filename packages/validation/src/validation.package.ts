import { Package, Provider } from '@artisanjs/core';
import { Validator } from './services/validator.service';

export class ValidationPackage {
  public static configure(): ValidationPackage {
    return new ValidationPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Validator,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
