import { Exchange } from './exchange.interface';
import { Message } from './message.interface';

export interface CheckResult {
  consumerCount: number;
  messageCount: number;
  queue: string;
}

export interface ConsumeOptions {
  arguments?: any;
  consumerTag?: string;
  exclusive?: boolean;
  noAck?: boolean;
  noLocal?: boolean;
  priority?: number;
}

export interface ConsumeResult {
  consumerTag: string;
}

export interface DeleteQueueOptions {
  ifEmpty?: boolean;
  ifUnused?: boolean;
}

export interface DeleteQueueResult {
  messageCount: number;
}

export interface GetMessageOptions {
  noAck?: boolean;
}

export interface PurgeResult {
  messageCount: number;
}

export interface Queue {
  name: string;

  bind(source: Exchange, pattern: string, args?: any): Promise<void>;
  check(): Promise<CheckResult>;
  consume(onMessage: (message: Message) => void, options?: ConsumeOptions): Promise<ConsumeResult>;
  delete(options?: DeleteQueueOptions): Promise<DeleteQueueResult>;
  getMessage(options?: GetMessageOptions): Promise<Message | false>;
  purge(): Promise<PurgeResult>;
  send(content: Buffer, options?: SendOptions): Promise<boolean>;
  send(content: Buffer, options?: SendOptions, callback?: (error: any, ok: any) => void): Promise<boolean>;
  unbind(source: Exchange, pattern: string, args?: any): Promise<void>;
}

export interface SendOptions {
  appId?: string;
  BCC?: string | string[];
  CC?: string | string[];
  contentEncoding?: string;
  contentType?: string;
  correlationId?: string;
  deliveryMode?: boolean | number;
  expiration?: string | number;
  headers?: any;
  mandatory?: boolean;
  messageId?: string;
  persistent?: boolean;
  priority?: number;
  replyTo?: string;
  timestamp?: number;
  type?: string;
  userId?: string;
}
