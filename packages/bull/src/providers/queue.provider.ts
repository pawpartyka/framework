import { Provider, Token } from '@artisanjs/core';
import bull from 'bull';
import { createQueueAdapter } from '../adapters/queue.adapter';
import { Queue } from '../interfaces/queue.interface';
import { getNativeQueueToken } from './native-queue.provider';

export function createQueueProvider(queueName: string): Provider {
  return {
    provide: getQueueToken(queueName),
    useFactory: (nativeQueue: bull.Queue): Queue => {
      return createQueueAdapter(nativeQueue);
    },
    inject: [getNativeQueueToken(queueName)],
  };
}

export function getQueueToken(name: string): Token {
  return `BullQueue_${ name }`;
}
