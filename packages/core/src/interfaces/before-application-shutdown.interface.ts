export interface BeforeApplicationShutdown {
  beforeApplicationShutdown(signal: string): void | Promise<void>;
}
