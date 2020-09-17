import { Client } from './client.interface';

export interface OnChannelConnection {
  onChannelConnection(client: Client): void | Promise<void>;
}
