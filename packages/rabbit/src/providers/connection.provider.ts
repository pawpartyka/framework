import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { createConnectionAdapter } from '../adapters/connection.adapter';
import { Connection } from '../interfaces/connection.interface';
import { getNativeConnectionToken } from './native-connection.provider';

export function createConnectionProvider(connectionName: string): Provider {
  return {
    provide: getConnectionToken(connectionName),
    useFactory: (nativeConnection: amqp.Connection): Connection => {
      return createConnectionAdapter(nativeConnection);
    },
    inject: [getNativeConnectionToken(connectionName)],
  };
}

export function getConnectionToken(name: string): Token {
  return `RabbitConnection_${ name }`;
}
