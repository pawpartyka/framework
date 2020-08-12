import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { StateMachineOptions } from '../interfaces/state-machine-options.interface';

export function createStateMachineOptionsProvider(stateMachineName: string, provider: StateMachineOptionsProvider): Provider {
  return {
    provide: getStateMachineOptionsToken(stateMachineName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getStateMachineOptionsToken(name: string): Token {
  return `StateMachineOptions_${ name }`;
}

export interface StateMachineOptionsFactory {
  createStateMachineOptions(): Promise<StateMachineOptions> | StateMachineOptions;
}

export type StateMachineOptionsProvider =
  | Omit<ClassProvider<StateMachineOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<StateMachineOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<StateMachineOptions>, 'provide' | 'multi'>;
