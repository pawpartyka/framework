import * as amqp from 'amqplib';
import { ConfirmChannel } from '../interfaces/confirm-channel.interface';
import { createChannelAdapter } from './channel.adapter';

export function createConfirmChannelAdapter(nativeConfirmChannel: amqp.ConfirmChannel): ConfirmChannel {
  return Object.assign({}, createChannelAdapter(nativeConfirmChannel), {
    waitForConfirms: async (): Promise<void> => {
      return await nativeConfirmChannel.waitForConfirms();
    },
  });
}
