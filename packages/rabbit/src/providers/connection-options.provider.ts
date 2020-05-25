import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { ConnectionOptions } from '../interfaces/connection-options.interface';

export function createConnectionOptionsProvider(connectionName: string, provider: ConnectionOptionsProvider): Provider {
  return {
    provide: getConnectionOptionsToken(connectionName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getConnectionOptionsToken(name: string): Token {
  return `RabbitConnectionOptions_${ name }`;
}

export interface ConnectionOptionsFactory {
  createConnectionOptions(): Promise<ConnectionOptions> | ConnectionOptions;
}

export type ConnectionOptionsProvider =
  | Omit<ClassProvider<ConnectionOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<ConnectionOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<ConnectionOptions>, 'provide' | 'multi'>;
