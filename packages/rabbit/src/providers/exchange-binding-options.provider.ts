import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';

export function createExchangeBindingOptionsProvider(exchangeName: string, sourceName: string, provider: ExchangeBindingOptionsProvider): Provider {
  return {
    provide: getExchangeBindingOptionsToken(exchangeName, sourceName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
    multi: true,
  };
}

export function getExchangeBindingOptionsToken(exchangeName: string, sourceName: string): Token {
  return `RabbitExchangeBindingOptions_${ exchangeName }-${ sourceName }`;
}

export interface ExchangeBindingOptions {
  args?: any;
  pattern: string;
}

export interface ExchangeBindingOptionsFactory {
  createExchangeBindingOptions(): Promise<ExchangeBindingOptions> | ExchangeBindingOptions;
}

export type ExchangeBindingOptionsProvider =
  | Omit<ClassProvider<ExchangeBindingOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<ExchangeBindingOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<ExchangeBindingOptions>, 'provide' | 'multi'>;
