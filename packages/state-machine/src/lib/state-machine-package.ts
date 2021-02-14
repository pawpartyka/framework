import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { createStateMachineOptionsProvider, StateMachineOptions, StateMachineOptionsProvider } from './providers/state-machine-options';
import { createStateMachineProvider } from './providers/state-machine';

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
