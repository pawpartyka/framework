import * as bull from 'bull';
import { Job, JobStatus } from '../interfaces/job.interface';
import { createQueueAdapter } from './queue.adapter';

export function createJobAdapter(nativeJob: bull.Job): Job {
  return {
    attemptsMade: nativeJob.attemptsMade,
    data: nativeJob.data,
    finishedOn: nativeJob.finishedOn,
    id: nativeJob.id,
    name: nativeJob.name,
    options: nativeJob.opts,
    processedOn: nativeJob.processedOn,
    queue: createQueueAdapter(nativeJob.queue),
    returnValue: nativeJob.returnvalue,
    stacktrace: nativeJob.stacktrace,
    timestamp: nativeJob.timestamp,

    discard: async (): Promise<void> => {
      await nativeJob.discard();
    },
    finished: async (): Promise<any> => {
      return await nativeJob.finished();
    },
    getState: async (): Promise<JobStatus> => {
      return await nativeJob.getState() as JobStatus;
    },
    isActive: async (): Promise<boolean> => {
      return await nativeJob.isActive();
    },
    isCompleted: async (): Promise<boolean> => {
      return await nativeJob.isCompleted();
    },
    isDelayed: async (): Promise<boolean> => {
      return await nativeJob.isDelayed();
    },
    isFailed: async (): Promise<boolean> => {
      return await nativeJob.isFailed();
    },
    isPaused: async (): Promise<boolean> => {
      return await nativeJob.isPaused();
    },
    isStuck: async (): Promise<boolean> => {
      return await nativeJob.isStuck();
    },
    isWaiting: async (): Promise<boolean> => {
      return await nativeJob.isWaiting();
    },
    lockKey: (): string => {
      return nativeJob.lockKey();
    },
    log: async (row: string): Promise<any> => {
      return await nativeJob.log(row);
    },
    moveToCompleted: async (returnValue?: string, ignoreLock?: boolean, notFetch?: boolean): Promise<[any, (number | string)] | null> => {
      return await nativeJob.moveToCompleted(returnValue, ignoreLock, notFetch);
    },
    moveToFailed: async (message: string, ignoreLock?: boolean): Promise<[any, (number | string)] | null> => {
      return await nativeJob.moveToFailed({ message }, ignoreLock);
    },
    progress: (value?: any): any | Promise<void> => {
      return nativeJob.progress(value);
    },
    promote: async (): Promise<void> => {
      await nativeJob.promote();
    },
    releaseLock: async (): Promise<void> => {
      await nativeJob.releaseLock();
    },
    remove: async (): Promise<void> => {
      await nativeJob.remove();
    },
    retry: async (): Promise<void> => {
      await nativeJob.retry();
    },
    takeLock: async (): Promise<number | false> => {
      return await nativeJob.takeLock();
    },
    update: async (data: any): Promise<void> => {
      await nativeJob.update(data);
    },
  };
}
