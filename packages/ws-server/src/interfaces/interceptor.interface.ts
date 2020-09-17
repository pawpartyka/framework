import { Client } from './client.interface';
import { Next } from './next.interface';

export interface Interceptor {
  intercept(data: any, client: Client, next: Next): void | Promise<void>;
}
