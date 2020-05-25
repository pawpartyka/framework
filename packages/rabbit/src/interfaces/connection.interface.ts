import { EventEmitter } from './event-emitter.interface';

export interface Connection extends EventEmitter {
  serverProperties: ServerProperties;

  close(): Promise<void>;
}

export interface ServerProperties {
  copyright?: string;
  host: string;
  information: string;
  platform: string;
  product: string;
  version: string;
  [key: string]: string | undefined;
}
