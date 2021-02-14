import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';

export function createStateMachineOptionsProvider(name: string, provider: StateMachineOptionsProvider): Provider {
  return {
    dependencies: provider['dependencies'],
    provide: getStateMachineOptionsToken(name),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
  };
}

export function getStateMachineOptionsToken(name: string): Token {
  return `StateMachineOptions_${ name }`;
}

export interface StateMachineOptions {
  states: {
    [state: string]: {
      on: {
        [state: string]: string;
      };
    };
  };
}

export interface StateMachineOptionsFactory {
  createStateMachineOptions(): Promise<StateMachineOptions> | StateMachineOptions;
}

export type StateMachineOptionsProvider =
  | Omit<ClassProvider<StateMachineOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<StateMachineOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<StateMachineOptions>, 'provide' | 'multi'>;
