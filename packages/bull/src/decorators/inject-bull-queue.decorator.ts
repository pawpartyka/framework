import { Inject } from '@artisanjs/core';
import { getQueueToken } from '../providers/queue.provider';

export function InjectBullQueue(name: string): ParameterDecorator {
  return Inject(getQueueToken(name));
}
