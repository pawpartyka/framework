import { Inject } from '@artisanjs/core';
import { getQueueToken } from '../providers/queue.provider';

export function InjectRabbitQueue(name: string): ParameterDecorator {
  return Inject(getQueueToken(name));
}
