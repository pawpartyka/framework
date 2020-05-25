export interface QueueOptions {
  arguments?: any;
  autoDelete?: boolean;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  durable?: boolean;
  exclusive?: boolean;
  expires?: number;
  maxLength?: number;
  maxPriority?: number;
  messageTtl?: number;
}
