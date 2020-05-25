import * as amqp from 'amqplib';
import { DeleteExchangeOptions, Exchange, PublishOptions } from '../interfaces/exchange.interface';

export function createExchangeAdapter(nativeChannel: amqp.Channel | amqp.ConfirmChannel, exchangeName: string): Exchange {
  return {
    name: exchangeName,

    bind: async (source: Exchange, pattern: string, args?: any): Promise<void> => {
      await nativeChannel.bindExchange(exchangeName, source.name, pattern, args);
    },
    check: async (): Promise<void> => {
      await nativeChannel.checkExchange(exchangeName);
    },
    delete: async (options?: DeleteExchangeOptions): Promise<void> => {
      await nativeChannel.deleteExchange(exchangeName, options);
    },
    publish: async (content: Buffer, routingKey: string, options?: PublishOptions, callback?: (error: any, ok: any) => void): Promise<boolean> => {
      return nativeChannel.publish(exchangeName, routingKey, content, options, callback);
    },
    unbind: async (source: Exchange, pattern: string, args?: any): Promise<void> => {
      await nativeChannel.unbindExchange(exchangeName, source.name, pattern, args);
    },
  };
}
