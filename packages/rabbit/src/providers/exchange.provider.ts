import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { createExchangeAdapter } from '../adapters/exchange.adapter';
import { ExchangeType } from '../enums/exchange-type.enum';
import { ExchangeOptions } from '../interfaces/exchange-options.interface';
import { Exchange } from '../interfaces/exchange.interface';
import { getExchangeOptionsToken } from './exchange-options.provider';
import { getNativeChannelToken } from './native-channel.provider';

export function createExchangeProvider(channelName: string, exchangeName: string, exchangeType: ExchangeType): Provider {
  return {
    provide: getExchangeToken(exchangeName),
    useFactory: async (nativeChannel: amqp.Channel | amqp.ConfirmChannel, exchangeOptions: ExchangeOptions): Promise<Exchange> => {
      await nativeChannel.assertExchange(exchangeName, exchangeType, {
        alternateExchange: exchangeOptions.alternateExchange,
        arguments: exchangeOptions.arguments,
        autoDelete: exchangeOptions.autoDelete,
        durable: exchangeOptions.durable,
        internal: exchangeOptions.internal,
      });

      return createExchangeAdapter(nativeChannel, exchangeName);
    },
    inject: [getNativeChannelToken(channelName), getExchangeOptionsToken(exchangeName)],
  };
}

export function getExchangeToken(name: string): Token {
  return `RabbitExchange_${ name }`;
}
