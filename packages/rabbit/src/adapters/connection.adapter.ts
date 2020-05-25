import * as amqp from 'amqplib';
import { Connection } from '../interfaces/connection.interface';

export function createConnectionAdapter(nativeConnection: amqp.Connection): Connection {
  return {
    serverProperties: nativeConnection.serverProperties,

    addListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.addListener(event, listener);
    },
    close: async (): Promise<void> => {
      await nativeConnection.close();
    },
    emit(event: string | symbol, ...args: any[]): boolean {
      return nativeConnection.emit(event, args);
    },
    eventNames(): (string | symbol)[] {
      return nativeConnection.eventNames();
    },
    getMaxListeners(): number {
      return nativeConnection.getMaxListeners();
    },
    listenerCount(type: string | symbol): number {
      return nativeConnection.listenerCount(type);
    },
    listeners(event: string | symbol): ((...args: any[]) => void)[] {
      return nativeConnection.listeners(event) as ((...args: any[]) => void)[];
    },
    off(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.off(event, listener);
    },
    on(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.on(event, listener);
    },
    once(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.once(event, listener);
    },
    prependListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.prependListener(event, listener);
    },
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.prependOnceListener(event, listener);
    },
    rawListeners(event: string | symbol): ((...args: any[]) => void)[] {
      return nativeConnection.rawListeners(event) as ((...args: any[]) => void)[];
    },
    removeAllListeners(event?: string | symbol): void {
      nativeConnection.removeAllListeners(event);
    },
    removeListener(event: string | symbol, listener: (...args: any[]) => void): void {
      nativeConnection.removeListener(event, listener);
    },
    setMaxListeners(max: number): void {
      nativeConnection.setMaxListeners(max);
    },
  };
}
