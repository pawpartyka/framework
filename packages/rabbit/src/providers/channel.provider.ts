import { Provider, Token } from '@artisanjs/core';
import * as amqp from 'amqplib';
import { createChannelAdapter } from '../adapters/channel.adapter';
import { createConfirmChannelAdapter } from '../adapters/confirm-channel.adapter';
import { ChannelMode } from '../enums/channel-mode.enum';
import { Channel } from '../interfaces/channel.interface';
import { ConfirmChannel } from '../interfaces/confirm-channel.interface';
import { getNativeChannelToken } from './native-channel.provider';

export function createChannelProvider(channelName: string, channelMode: ChannelMode): Provider {
  return {
    provide: getChannelToken(channelName),
    useFactory: (nativeChannel: amqp.Channel | amqp.ConfirmChannel): Channel | ConfirmChannel => {
      switch (channelMode) {
        case ChannelMode.CONFIRM:
          return createConfirmChannelAdapter(nativeChannel as amqp.ConfirmChannel);
        case ChannelMode.REGULAR:
          return createChannelAdapter(nativeChannel as amqp.Channel);
      }
    },
    inject: [getNativeChannelToken(channelName)],
  };
}

export function getChannelToken(name: string): Token {
  return `RabbitChannel_${ name }`;
}
