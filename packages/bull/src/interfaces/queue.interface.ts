import * as redis from 'ioredis';
import { EventEmitter } from './event-emitter.interface';
import { CronRepeatOptions, EveryRepeatOptions, JobOptions } from './job-options.interface';
import { Job } from './job.interface';

export enum JobStatusClean {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  FAILED = 'failed',
  WAIT = 'wait',
}

export interface AddOptions extends JobOptions {
  name?: string;
}

export interface JobCounts {
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  waiting: number;
}

export interface JobInformation {
  key: string;
  name: string;
  id?: string;
  endDate?: number;
  tz?: string;
  cron: string;
  every: number;
  next: number;
}

export interface JobLogs {
  count: number;
  logs: string[];
}

export interface ProcessOptions {
  concurrency?: number;
  jobName?: string;
}

export interface Queue<T = any> extends EventEmitter {
  client: redis.Redis;
  clients: redis.Redis[];
  name: string;

  add(data: T, options?: AddOptions): Promise<Job<T>>;
  base64Name(): string;
  clean(grace: number, status?: JobStatusClean, limit?: number): Promise<Job<T>[]>;
  clientName(): string;
  close(doNotWaitJobs?: boolean): Promise<void>;
  count(): Promise<number>;
  empty(): Promise<void>;
  getActive(start?: number, end?: number): Promise<Job<T>[]>;
  getActiveCount(): Promise<number>;
  getCompleted(start?: number, end?: number): Promise<Job<T>[]>;
  getCompletedCount(): Promise<number>;
  getDelayed(start?: number, end?: number): Promise<Job<T>[]>;
  getDelayedCount(): Promise<number>;
  getFailed(start?: number, end?: number): Promise<Job<T>[]>;
  getFailedCount(): Promise<number>;
  getJob(jobId: number | string): Promise<Job<T> | null>;
  getJobCountByTypes(types: string | string[]): Promise<JobCounts>;
  getJobCounts(): Promise<JobCounts>;
  getJobLogs(jobId: string, start?: number, end?: number): Promise<JobLogs>;
  getJobs(types: string[], start?: number, end?: number, asc?: boolean): Promise<Job<T>[]>;
  getPausedCount(): Promise<number>;
  getRepeatableCount(): Promise<number>;
  getRepeatableJobs(start?: number, end?: number, asc?: boolean): Promise<JobInformation[]>;
  getWaiting(start?: number, end?: number): Promise<Job<T>[]>;
  getWaitingCount(): Promise<number>;
  getWorkers(): Promise<redis.Redis[]>;
  isReady(): Promise<void>;
  multi(): redis.Pipeline;
  nextRepeatableJob(name: string, data: any, options: JobOptions): Promise<Job<T>>;
  parseClientList(list: string): redis.Redis[];
  pause(isLocal?: boolean): Promise<void>;
  process(callback: (job: Job<T>, done: (error?: Error | null, value?: any) => void) => void | Promise<void>, options?: ProcessOptions): Promise<void>;
  removeRepeatable(options: RemoveRepeatableOptions): Promise<void>;
  removeRepeatableByKey(key: string): Promise<void>;
  resume(isLocal?: boolean): Promise<void>;
  setWorkerName(): Promise<any>;
  toKey(queueType: string): string;
  whenCurrentJobsFinished(): Promise<void>;
}

export type RemoveRepeatableOptions = (CronRepeatOptions | EveryRepeatOptions) & { jobId?: number | string; name?: string; };
