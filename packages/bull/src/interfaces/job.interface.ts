import { JobOptions } from './job-options.interface';
import { Queue } from './queue.interface';

export enum JobStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  FAILED = 'failed',
  WAITING = 'waiting',
}

export interface Job<T = any> {
  attemptsMade: number;
  data: T;
  finishedOn?: number;
  id: number | string;
  name: string;
  options: JobOptions;
  processedOn?: number;
  queue: Queue<T>;
  returnValue: any;
  stacktrace: string[];
  timestamp: number;

  discard(): Promise<void>;
  finished(): Promise<any>;
  getState(): Promise<JobStatus>;
  isActive(): Promise<boolean>;
  isCompleted(): Promise<boolean>;
  isDelayed(): Promise<boolean>;
  isFailed(): Promise<boolean>;
  isPaused(): Promise<boolean>;
  isStuck(): Promise<boolean>;
  isWaiting(): Promise<boolean>;
  lockKey(): string;
  log(row: string): Promise<any>;
  moveToCompleted(returnValue?: string, ignoreLock?: boolean, notFetch?: boolean): Promise<[any, number | string] | null>;
  moveToFailed(message: string, ignoreLock?: boolean): Promise<[any, number | string] | null>;
  progress(): any;
  progress(value: any): Promise<void>;
  promote(): Promise<void>;
  releaseLock(): Promise<void>;
  remove(): Promise<void>;
  retry(): Promise<void>;
  takeLock(): Promise<number | false>;
  update(data: any): Promise<void>;
}
