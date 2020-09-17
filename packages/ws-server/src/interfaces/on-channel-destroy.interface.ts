export interface OnChannelDestroy {
  onChannelDestroy(params: { [name: string]: string; }): void | Promise<void>;
}
