import redis from 'ioredis';
import { JobOptions } from './job-options.interface';

export interface AdvancedSettings {
  backoffStrategies?: {
    [key: string]: (attemptsMade: number, error: Error) => number;
  };
  drainDelay?: number;
  guardInterval?: number;
  lockDuration?: number;
  lockRenewTime?: number;
  maxStalledCount?: number;
  retryProcessDelay?: number;
  stalledInterval?: number;
}

export interface QueueOptions {
  createClient?: (type: 'client' | 'subscriber' | 'bclient', options?: redis.RedisOptions) => redis.Redis | redis.Cluster;
  defaultJobOptions?: JobOptions;
  limiter?: RateLimiter;
  prefix?: string;
  redis?: string | redis.RedisOptions;
  settings?: AdvancedSettings;
  url?: string;
}

export interface RateLimiter {
  bounceBack?: boolean;
  duration: number;
  max: number;
}
