export interface DeleteExchangeOptions {
  ifUnused?: boolean;
}

export interface Exchange {
  name: string;

  bind(source: Exchange, pattern: string, args?: any): Promise<void>;
  check(): Promise<void>;
  delete(options?: DeleteExchangeOptions): Promise<void>;
  publish(content: Buffer, routingKey: string, options?: PublishOptions): Promise<boolean>;
  publish(content: Buffer, routingKey: string, options?: PublishOptions, callback?: (error: any, ok: any) => void): Promise<boolean>;
  unbind(source: Exchange, pattern: string, args?: any): Promise<void>;
}

export interface PublishOptions {
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
