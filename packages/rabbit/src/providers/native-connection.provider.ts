import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { ConnectionOptions } from '../interfaces/connection-options.interface';
import { getConnectionOptionsToken } from './connection-options.provider';

export function createNativeConnectionProvider(connectionName: string): Provider {
  return {
    provide: getNativeConnectionToken(connectionName),
    useFactory: async (connectionOptions: ConnectionOptions): Promise<any> => {
      return await amqp.connect(connectionOptions.url, connectionOptions.socketOptions);
    },
    inject: [getConnectionOptionsToken(connectionName)],
  };
}

export function getNativeConnectionToken(name: string): Token {
  return `RabbitNativeConnection_${ name }`;
}
