import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';

export function createQueueBindingOptionsProvider(queueName: string, sourceName: string, provider: QueueBindingOptionsProvider): Provider {
  return {
    provide: getQueueBindingOptionsToken(queueName, sourceName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
    multi: true,
  };
}

export function getQueueBindingOptionsToken(queueName: string, sourceName: string): Token {
  return `RabbitQueueBindingOptions_${ queueName }-${ sourceName }`;
}

export interface QueueBindingOptions {
  args?: any;
  pattern: string;
}

export interface QueueBindingOptionsFactory {
  createQueueBindingOptions(): Promise<QueueBindingOptions> | QueueBindingOptions;
}

export type QueueBindingOptionsProvider =
  | Omit<ClassProvider<QueueBindingOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<QueueBindingOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<QueueBindingOptions>, 'provide' | 'multi'>;
