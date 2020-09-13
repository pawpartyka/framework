import { Package, Provider } from '@artisanjs/core';
import { Validator } from './services/validator.service';

const BUILT_IN_SERVICES: Provider[] = [
  Validator,
];

export class ValidationPackage {
  public static configure(): ValidationPackage {
    return new ValidationPackage();
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
