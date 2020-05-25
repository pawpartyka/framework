import * as bull from 'bull';
import * as redis from 'ioredis';
import { JobOptions } from '../interfaces/job-options.interface';
import { Job } from '../interfaces/job.interface';
import { AddOptions, JobCounts, JobInformation, JobLogs, JobStatusClean, ProcessOptions, Queue, RemoveRepeatableOptions } from '../interfaces/queue.interface';
import { createJobAdapter } from './job.adapter';

export function createQueueAdapter(nativeQueue: bull.Queue): Queue {
  return {
    client: nativeQueue.client,
    clients: nativeQueue.clients,
    name: nativeQueue.name,

    add: async (data: any, options?: AddOptions): Promise<Job> => {
      const args: any[] = [data, options];

      if (options?.name) {
        args.unshift(options.name);
      }

      return createJobAdapter(await nativeQueue.add.apply(nativeQueue, args));
    },
    addListener: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.addListener(event, listener);
    },
    base64Name: (): string => {
      return nativeQueue.base64Name();
    },
    clean: async (grace: number, status?: JobStatusClean, limit?: number): Promise<Job[]> => {
      return (await nativeQueue.clean(grace, status, limit)).map(job => createJobAdapter(job));
    },
    clientName: (): string => {
      return nativeQueue.clientName();
    },
    close: async (doNotWaitJobs?: boolean): Promise<void> => {
      await nativeQueue.close(doNotWaitJobs);
    },
    count: async (): Promise<number> => {
      return await nativeQueue.count();
    },
    emit: (event: string | symbol, ...args): boolean => {
      return nativeQueue.emit(event, args);
    },
    empty: async (): Promise<void> => {
      await nativeQueue.empty();
    },
    eventNames: (): (string | symbol)[] => {
      return nativeQueue.eventNames();
    },
    getActive: async (start?: number, end?: number): Promise<Job[]> => {
      return (await nativeQueue.getActive(start, end)).map(job => createJobAdapter(job));
    },
    getActiveCount: async (): Promise<number> => {
      return await nativeQueue.getActiveCount();
    },
    getCompleted: async (start?: number, end?: number): Promise<Job[]> => {
      return (await nativeQueue.getCompleted(start, end)).map(job => createJobAdapter(job));
    },
    getCompletedCount: async (): Promise<number> => {
      return await nativeQueue.getCompletedCount();
    },
    getDelayed: async (start?: number, end?: number): Promise<Job[]> => {
      return (await nativeQueue.getDelayed(start, end)).map(job => createJobAdapter(job));
    },
    getDelayedCount: async (): Promise<number> => {
      return await nativeQueue.getDelayedCount();
    },
    getFailed: async (start?: number, end?: number): Promise<Job[]> => {
      return (await nativeQueue.getFailed(start, end)).map(job => createJobAdapter(job));
    },
    getFailedCount: async (): Promise<number> => {
      return await nativeQueue.getFailedCount();
    },
    getJob: async (jobId: number | string): Promise<Job | null> => {
      const job: bull.Job | null = await nativeQueue.getJob(jobId);

      return job ? createJobAdapter(job) : null;
    },
    getJobCountByTypes: async (types: string | string[]): Promise<JobCounts> => {
      return await nativeQueue.getJobCountByTypes(types as any);
    },
    getJobCounts: async (): Promise<JobCounts> => {
      return await nativeQueue.getJobCounts();
    },
    getJobLogs: async (jobId: string, start?: number, end?: number): Promise<JobLogs> => {
      return await nativeQueue.getJobLogs(jobId, start, end);
    },
    getJobs: async (types: string[], start?: number, end?: number, asc?: boolean): Promise<Job[]> => {
      return (await nativeQueue.getJobs(types as any, start, end, asc)).map(job => createJobAdapter(job));
    },
    getMaxListeners: (): number => {
      return nativeQueue.getMaxListeners();
    },
    getPausedCount: async (): Promise<number> => {
      return await nativeQueue.getPausedCount();
    },
    getRepeatableCount: async (): Promise<number> => {
      return await nativeQueue.getRepeatableCount();
    },
    getRepeatableJobs: async (start?: number, end?: number, asc?: boolean): Promise<JobInformation[]> => {
      return await nativeQueue.getRepeatableJobs(start, end, asc);
    },
    getWaiting: async (start?: number, end?: number): Promise<Job[]> => {
      return (await nativeQueue.getWaiting(start, end)).map(job => createJobAdapter(job));
    },
    getWaitingCount: async (): Promise<number> => {
      return await nativeQueue.getWaitingCount();
    },
    getWorkers: async (): Promise<redis.Redis[]> => {
      return await nativeQueue.getWorkers();
    },
    isReady: async (): Promise<void> => {
      await nativeQueue.isReady();
    },
    listenerCount: (type: string | symbol): number => {
      return nativeQueue.listenerCount(type);
    },
    listeners: (event: string | symbol): ((...args: any[]) => void)[] => {
      return nativeQueue.listeners(event) as ((...args: any[]) => void)[];
    },
    multi: (): redis.Pipeline => {
      return nativeQueue.multi();
    },
    nextRepeatableJob: async (name: string, data: any, options: JobOptions): Promise<Job> => {
      return createJobAdapter(await nativeQueue.nextRepeatableJob(name, data, options));
    },
    off: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.off(event, listener);
    },
    on: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.on(event as string, listener);
    },
    once: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.once(event, listener);
    },
    parseClientList: (list: string): redis.Redis[] => {
      return nativeQueue.parseClientList(list);
    },
    pause: async (isLocal?: boolean): Promise<void> => {
      await nativeQueue.pause(isLocal);
    },
    prependListener: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.prependListener(event, listener);
    },
    prependOnceListener: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.prependOnceListener(event, listener);
    },
    process: async (callback: (...args: any[]) => any, options?: ProcessOptions): Promise<void> => {
      const args: any[] = [callback];

      if (options?.concurrency) {
        args.unshift(options.concurrency);
      }

      if (options?.jobName) {
        args.unshift(options.jobName);
      }

      await nativeQueue.process.apply(nativeQueue, args);
    },
    rawListeners: (event: string | symbol): ((...args: any[]) => void)[] => {
      return nativeQueue.rawListeners(event) as ((...args: any[]) => void)[];
    },
    removeAllListeners: (event?: string | symbol): void => {
      nativeQueue.removeAllListeners(event);
    },
    removeListener: (event: string | symbol, listener: (...args: any[]) => void): void => {
      nativeQueue.removeListener(event, listener);
    },
    removeRepeatable: async (options: RemoveRepeatableOptions): Promise<void> => {
      await nativeQueue.removeRepeatable(options.name, options);
    },
    removeRepeatableByKey: async (key: string): Promise<void> => {
      await nativeQueue.removeRepeatableByKey(key);
    },
    resume: async (isLocal?: boolean): Promise<void> => {
      await nativeQueue.resume(isLocal);
    },
    setMaxListeners: (max: number): void => {
      nativeQueue.setMaxListeners(max);
    },
    setWorkerName: async (): Promise<any> => {
      return await nativeQueue.setWorkerName();
    },
    toKey: (queueType: string): string => {
      return nativeQueue.toKey(queueType);
    },
    whenCurrentJobsFinished: async (): Promise<void> => {
      await nativeQueue.whenCurrentJobsFinished();
    },
  };
}
