import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { StateMachineOptions } from './interfaces/state-machine-options.interface';
import { createStateMachineOptionsProvider, StateMachineOptionsProvider } from './providers/state-machine-options.provider';
import { createStateMachineProvider } from './providers/state-machine.provider';

export class StateMachinePackage {
  public static configure(): StateMachinePackage {
    return new StateMachinePackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [];
  }

  public declareStateMachine(name: string, options: StateMachineOptions | StateMachineOptionsProvider): StateMachinePackage {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createStateMachineOptionsProvider(name, options));
    } else {
      this.providers.push(createStateMachineOptionsProvider(name, { useFactory: () => options as StateMachineOptions }));
    }

    this.providers.push(createStateMachineProvider(name));

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
