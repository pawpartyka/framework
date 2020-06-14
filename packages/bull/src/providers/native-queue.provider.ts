import { Provider, Token } from '@artisanjs/core';
import NativeQueue from 'bull';
import { QueueOptions } from '../interfaces/queue-options.interface';
import { getQueueOptionsToken } from './queue-options.provider';

export function createNativeQueueProvider(queueName: string): Provider {
  return {
    provide: getNativeQueueToken(queueName),
    useFactory: (queueOptions: QueueOptions): NativeQueue.Queue => {
      return new NativeQueue(queueName, queueOptions.url, {
        createClient: queueOptions.createClient,
        defaultJobOptions: queueOptions.defaultJobOptions,
        limiter: queueOptions.limiter,
        prefix: queueOptions.prefix,
        redis: queueOptions.redis,
        settings: queueOptions.settings,
      });
    },
    inject: [getQueueOptionsToken(queueName)],
  };
}

export function getNativeQueueToken(name: string): Token {
  return `BullNativeQueue_${ name }`;
}
