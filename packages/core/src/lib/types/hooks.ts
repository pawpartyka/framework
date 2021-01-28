export interface OnApplicationInit {
  onApplicationInit(): void | Promise<void>;
}

export interface OnApplicationListen {
  onApplicationListen(): void | Promise<void>;
}

export interface OnApplicationShutdown {
  onApplicationShutdown(signal?: string): void | Promise<void>;
}
