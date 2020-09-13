import { Logger, Package, Provider } from '@artisanjs/core';
import { ShellLogger } from './services/shell-logger.service';

const BUILT_IN_SERVICES: Provider[] = [
  {
    provide: Logger,
    useClass: ShellLogger,
  },
];

export class ShellPackage {
  public static configure(): ShellPackage {
    return new ShellPackage();
  }

  private readonly providers: Provider[];

  constructor() {
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
