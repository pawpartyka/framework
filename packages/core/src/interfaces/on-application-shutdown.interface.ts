export interface OnApplicationShutdown {
  onApplicationShutdown(signal: string): void | Promise<void>;
}
