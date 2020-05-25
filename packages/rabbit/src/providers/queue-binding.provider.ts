import { Provider, Token } from '@artisanjs/core';
import { Exchange } from '../interfaces/exchange.interface';
import { Queue } from '../interfaces/queue.interface';
import { getExchangeToken } from './exchange.provider';
import { getQueueBindingOptionsToken, QueueBindingOptions } from './queue-binding-options.provider';
import { getQueueToken } from './queue.provider';

export function createQueueBindingProvider(queueName: string, sourceName: string): Provider {
  return {
    provide: getQueueBindingToken(queueName),
    useFactory: async (queue: Queue, source: Exchange, queueBindingOptions: QueueBindingOptions[]) => {
      for (const it of queueBindingOptions) {
        await queue.bind(source, it.pattern, it.args);
      }
    },
    inject: [getQueueToken(queueName), getExchangeToken(sourceName), getQueueBindingOptionsToken(queueName, sourceName)],
  };
}

export function getQueueBindingToken(name: string): Token {
  return `RabbitQueueBinding_${ name }`;
}
