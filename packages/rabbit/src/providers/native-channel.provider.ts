import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { ChannelMode } from '../enums/channel-mode.enum';
import { getNativeConnectionToken } from './native-connection.provider';

export function createNativeChannelProvider(connectionName: string, channelName: string, channelMode: ChannelMode): Provider {
  return {
    provide: getNativeChannelToken(channelName),
    useFactory: async (nativeConnection: amqp.Connection): Promise<amqp.Channel | amqp.ConfirmChannel> => {
      switch (channelMode) {
        case ChannelMode.CONFIRM:
          return await nativeConnection.createConfirmChannel();
        case ChannelMode.REGULAR:
          return await nativeConnection.createChannel();
      }
    },
    inject: [getNativeConnectionToken(connectionName)],
  };
}

export function getNativeChannelToken(name: string): Token {
  return `RabbitNativeChannel_${ name }`;
}
