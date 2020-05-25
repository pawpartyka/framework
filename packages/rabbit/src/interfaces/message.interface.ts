export interface AckOptions {
  allUpTo?: boolean;
}

export interface Message {
  content: Buffer;
  fields: any;
  properties: any;

  ack(options?: AckOptions): void;
  nack(options?: NackOptions): void;
  reject(options?: RejectOptions): void;
}

export interface NackOptions {
  allUpTo?: boolean;
  requeue?: boolean;
}

export interface RejectOptions {
  requeue?: boolean;
}
