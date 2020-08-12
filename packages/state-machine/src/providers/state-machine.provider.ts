import { Provider, Token } from '@artisanjs/core';
import { StateMachineOptions } from '../interfaces/state-machine-options.interface';
import { StateMachine, TransitionResult } from '../interfaces/state-machine.interface';
import { getStateMachineOptionsToken } from './state-machine-options.provider';

export function createStateMachineProvider(stateMachineName: string): Provider {
  return {
    provide: getStateMachineToken(stateMachineName),
    useFactory: (stateMachineOptions: StateMachineOptions): StateMachine => {
      return {
        transition: (state: string, event: string): TransitionResult => {
          return {
            state: stateMachineOptions.states[state]?.on[event] || state,
          };
        },
      };
    },
    inject: [getStateMachineOptionsToken(stateMachineName)],
  };
}

export function getStateMachineToken(name: string): Token {
  return `StateMachine_${ name }`;
}
