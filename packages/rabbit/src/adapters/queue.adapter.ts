import * as amqp from 'amqplib';
import { Exchange } from '../interfaces/exchange.interface';
import { Message } from '../interfaces/message.interface';
import {
  CheckResult,
  ConsumeOptions,
  ConsumeResult,
  DeleteQueueOptions,
  DeleteQueueResult,
  GetMessageOptions,
  PurgeResult,
  Queue,
  SendOptions,
} from '../interfaces/queue.interface';
import { createMessageAdapter } from './message.adapter';

export function createQueueAdapter(nativeChannel: amqp.Channel | amqp.ConfirmChannel, queueName: string): Queue {
  return {
    name: queueName,

    bind: async (source: Exchange, pattern: string, args?: any): Promise<void> => {
      await nativeChannel.bindQueue(queueName, source.name, pattern, args);
    },
    check: async (): Promise<CheckResult> => {
      return await nativeChannel.checkQueue(queueName);
    },
    consume: async (onMessage: (message: Message) => void, options?: ConsumeOptions): Promise<ConsumeResult> => {
      return await nativeChannel.consume(queueName, nativeMessage => onMessage(createMessageAdapter(nativeChannel, nativeMessage)), options);
    },
    delete: async (options?: DeleteQueueOptions): Promise<DeleteQueueResult> => {
      return await nativeChannel.deleteQueue(queueName, options);
    },
    getMessage: async (options?: GetMessageOptions): Promise<Message | false> => {
      const nativeMessage = await nativeChannel.get(queueName, options);

      return nativeMessage ? createMessageAdapter(nativeChannel, nativeMessage) : false;
    },
    purge: async (): Promise<PurgeResult> => {
      return await nativeChannel.purgeQueue(queueName);
    },
    send: async (content: Buffer, options?: SendOptions, callback?: (error: any, ok: any) => void): Promise<boolean> => {
      return nativeChannel.sendToQueue(queueName, content, options, callback);
    },
    unbind: async (source: Exchange, pattern: string, args?: any): Promise<void> => {
      await nativeChannel.unbindQueue(queueName, source.name, pattern, args);
    },
  };
}
