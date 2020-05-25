import { EventEmitter } from './event-emitter.interface';

export interface Channel extends EventEmitter {
  ackAll(): Promise<void>;
  cancel(consumerTag: string): Promise<void>;
  close(): Promise<void>;
  nackAll(requeue?: boolean): Promise<void>;
  on(event: string | symbol, listener: (...args: any[]) => void): void;
  once(event: string | symbol, listener: (...args: any[]) => void): void;
  prefetch(count: number, global?: boolean): Promise<void>;
  recover(): Promise<void>;
}
