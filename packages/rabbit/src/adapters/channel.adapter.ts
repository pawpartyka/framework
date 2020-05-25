import * as amqp from 'amqplib';
import { Channel } from '../interfaces/channel.interface';

export function createChannelAdapter(nativeChannel: amqp.Channel): Channel {
  return {
    ackAll: async (): Promise<void> => {
      nativeChannel.ackAll();
    },
    addListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.addListener(event, listener);
    },
    cancel: async (consumerTag: string): Promise<void> => {
      await nativeChannel.cancel(consumerTag);
    },
    close: async (): Promise<void> => {
      await nativeChannel.close();
    },
    emit(event: string | symbol, ...args: any[]): boolean {
      return nativeChannel.emit(event, args);
    },
    eventNames(): (string | symbol)[] {
      return nativeChannel.eventNames();
    },
    getMaxListeners(): number {
      return nativeChannel.getMaxListeners();
    },
    listenerCount(type: string | symbol): number {
      return nativeChannel.listenerCount(type);
    },
    listeners(event: string | symbol): ((...args: any[]) => void)[] {
      return nativeChannel.listeners(event) as ((...args: any[]) => void)[];
    },
    nackAll: async (requeue?: boolean): Promise<void> => {
      nativeChannel.nackAll(requeue);
    },
    off(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.off(event, listener);
    },
    on(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.on(event, listener);
    },
    once(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.once(event, listener);
    },
    prefetch: async (count: number, global?: boolean): Promise<void> => {
      await nativeChannel.prefetch(count, global);
    },
    prependListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.prependListener(event, listener);
    },
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.prependOnceListener(event, listener);
    },
    rawListeners(event: string | symbol): ((...args: any[]) => void)[] {
      return nativeChannel.rawListeners(event) as ((...args: any[]) => void)[];
    },
    recover: async (): Promise<void> => {
      await nativeChannel.recover();
    },
    removeAllListeners(event?: string | symbol): void {
      nativeChannel.removeAllListeners(event);
    },
    removeListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeChannel.removeListener(event, listener);
    },
    setMaxListeners(max: number): void {
      nativeChannel.setMaxListeners(max);
    },
  };
}
