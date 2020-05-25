import { Provider, Token } from '@artisanjs/core';
import { Exchange } from '../interfaces/exchange.interface';
import { getExchangeBindingOptionsToken, ExchangeBindingOptions } from './exchange-binding-options.provider';
import { getExchangeToken } from './exchange.provider';

export function createExchangeBindingProvider(exchangeName: string, sourceName: string): Provider {
  return {
    provide: getExchangeBindingToken(exchangeName),
    useFactory: async (exchange: Exchange, source: Exchange, exchangeBindingOptions: ExchangeBindingOptions[]) => {
      for (const it of exchangeBindingOptions) {
        await exchange.bind(source, it.pattern, it.args);
      }
    },
    inject: [getExchangeToken(exchangeName), getExchangeToken(sourceName), getExchangeBindingOptionsToken(exchangeName, sourceName)],
  };
}

export function getExchangeBindingToken(name: string): Token {
  return `RabbitExchangeBinding_${ name }`;
}
