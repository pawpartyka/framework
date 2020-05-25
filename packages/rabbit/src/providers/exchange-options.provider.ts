import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { ExchangeOptions } from '../interfaces/exchange-options.interface';

export function createExchangeOptionsProvider(exchangeName: string, provider: ExchangeOptionsProvider): Provider {
  return {
    provide: getExchangeOptionsToken(exchangeName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getExchangeOptionsToken(name: string): Token {
  return `RabbitExchangeOptions_${ name }`;
}

export interface ExchangeOptionsFactory {
  createExchangeOptions(): Promise<ExchangeOptions> | ExchangeOptions;
}

export type ExchangeOptionsProvider =
  | Omit<ClassProvider<ExchangeOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<ExchangeOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<ExchangeOptions>, 'provide' | 'multi'>;
