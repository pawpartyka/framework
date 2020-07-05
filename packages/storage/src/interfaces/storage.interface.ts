export interface LsOptions {
  encoding?: string;
}

export interface MkdirOptions {
  recursive?: boolean;
  mode?: number | string;
}

export interface StatResult {
  mtime: Date;
  size: number;
}

export interface Storage {
  cp(source: string, dest: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  ls(path: string, options?: LsOptions): Promise<string[]>;
  mkdir(path: string, options?: MkdirOptions): Promise<void>;
  mv(source: string, dest: string): Promise<void>;
  read(path: string, options?: ReadOptions): Promise<Buffer | never>;
  rmdir(path: string, options?: RmdirOptions): Promise<void>;
  stat(path: string): Promise<StatResult>;
  unlink(path: string): Promise<void>;
  write(path: string, data: Buffer, options?: WriteOptions): Promise<void | never>;
}

export interface ReadOptions {
  encoding?: string;
  flag?: string;
}

export interface RmdirOptions {
  maxRetries?: number;
  recursive?: boolean;
  retryDelay?: number;
}

export interface WriteOptions {
  encoding?: string;
  flag?: string;
  mode?: number | string;
}
