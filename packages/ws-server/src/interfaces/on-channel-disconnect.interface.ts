import { Client } from './client.interface';

export interface OnChannelDisconnect {
  onChannelDisconnect(client: Client): void | Promise<void>;
}
