export interface EventEmitter {
  addListener(event: string | symbol, listener: (...args: any[]) => void): void;
  emit(event: string | symbol, ...args: any[]): boolean;
  eventNames(): (string | symbol)[];
  getMaxListeners(): number;
  listenerCount(type: string | symbol): number;
  listeners(event: string | symbol): ((...args: any[]) => void)[];
  off(event: string | symbol, listener: (...args: any[]) => void): void;
  on(event: string | symbol, listener: (...args: any[]) => void): void;
  once(event: string | symbol, listener: (...args: any[]) => void): void;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): void;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): void;
  rawListeners(event: string | symbol): ((...args: any[]) => void)[];
  removeAllListeners(event?: string | symbol): void;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): void;
  setMaxListeners(max: number): void;
}
