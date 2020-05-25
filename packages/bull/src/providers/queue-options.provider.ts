import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { QueueOptions } from '../interfaces/queue-options.interface';

export function createQueueOptionsProvider(queueName: string, provider: QueueOptionsProvider): Provider {
  return {
    provide: getQueueOptionsToken(queueName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getQueueOptionsToken(name: string): Token {
  return `BullQueueOptions_${ name }`;
}

export interface QueueOptionsFactory {
  createQueueOptions(): Promise<QueueOptions> | QueueOptions;
}

export type QueueOptionsProvider =
  | Omit<ClassProvider<QueueOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<QueueOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<QueueOptions>, 'provide' | 'multi'>;
