import * as amqp from 'amqplib';
import { AckOptions, Message, NackOptions, RejectOptions } from '../interfaces/message.interface';

export function createMessageAdapter(nativeChannel: amqp.Channel | amqp.ConfirmChannel, nativeMessage: amqp.Message | amqp.GetMessage): Message {
  return {
    content: nativeMessage.content,
    fields: nativeMessage.fields,
    properties: nativeMessage.properties,

    ack: (options?: AckOptions): void => {
      nativeChannel.ack(nativeMessage, options?.allUpTo);
    },
    nack: (options?: NackOptions): void => {
      nativeChannel.nack(nativeMessage, options?.allUpTo, options?.requeue);
    },
    reject: (options?: RejectOptions): void => {
      nativeChannel.reject(nativeMessage, options?.requeue);
    },
  };
}
