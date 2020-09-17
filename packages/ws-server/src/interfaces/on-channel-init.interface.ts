export interface OnChannelInit {
  onChannelInit(params: { [name: string]: string; }): void | Promise<void>;
}
