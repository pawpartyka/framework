import { Inject } from '@artisanjs/core';
import { getStateMachineToken } from '../providers/state-machine.provider';

export function InjectStateMachine(name: string): ParameterDecorator {
  return Inject(getStateMachineToken(name));
}
