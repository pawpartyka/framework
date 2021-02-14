import { Inject } from '@artisanjs/core';
import { getStateMachineToken } from '../providers/state-machine';

export function InjectStateMachine(name: string): ParameterDecorator {
  return Inject(getStateMachineToken(name));
}
