import { Provider, Token } from '@artisanjs/core';
import { getStateMachineOptionsToken, StateMachineOptions } from './state-machine-options';

export function createStateMachineProvider(name: string): Provider {
  return {
    dependencies: [getStateMachineOptionsToken(name)],
    provide: getStateMachineToken(name),
    useFactory: (stateMachineOptions: StateMachineOptions): StateMachine => {
      return {
        transition: (state: string, event: string): TransitionResult => {
          return {
            state: stateMachineOptions.states[state]?.on[event] || state,
          };
        },
      };
    },
  };
}

export function getStateMachineToken(name: string): Token {
  return `StateMachine_${ name }`;
}

export interface StateMachine {
  transition(state: string, event: string): TransitionResult;
}

export interface TransitionResult {
  state: string;
}
