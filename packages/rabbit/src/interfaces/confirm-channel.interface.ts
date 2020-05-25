import { Channel } from './channel.interface';

export interface ConfirmChannel extends Channel {
  waitForConfirms(): Promise<void>;
}
