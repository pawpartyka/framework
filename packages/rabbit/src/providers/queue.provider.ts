import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { createQueueAdapter } from '../adapters/queue.adapter';
import { QueueOptions } from '../interfaces/queue-options.interface';
import { Queue } from '../interfaces/queue.interface';
import { getNativeChannelToken } from './native-channel.provider';
import { getQueueOptionsToken } from './queue-options.provider';

export function createQueueProvider(channelName: string, queueName: string): Provider {
  return {
    provide: getQueueToken(queueName),
    useFactory: async (nativeChannel: amqp.Channel | amqp.ConfirmChannel, queueOptions: QueueOptions): Promise<Queue> => {
      await nativeChannel.assertQueue(queueName, {
        arguments: queueOptions.arguments,
        autoDelete: queueOptions.autoDelete,
        deadLetterExchange: queueOptions.deadLetterExchange,
        deadLetterRoutingKey: queueOptions.deadLetterRoutingKey,
        durable: queueOptions.durable,
        exclusive: queueOptions.exclusive,
        expires: queueOptions.expires,
        maxLength: queueOptions.maxLength,
        maxPriority: queueOptions.maxPriority,
        messageTtl: queueOptions.messageTtl,
      });

      return createQueueAdapter(nativeChannel, queueName);
    },
    inject: [getNativeChannelToken(channelName), getQueueOptionsToken(queueName)],
  };
}

export function getQueueToken(name: string): Token {
  return `RabbitQueue_${ name }`;
}
