export interface BackoffOptions {
  delay?: number;
  type: string;
}

export interface CronRepeatOptions extends RepeatOptions {
  cron: string;
  startDate?: Date | string | number;
}

export interface EveryRepeatOptions extends RepeatOptions {
  every: number;
}

export interface JobOptions {
  attempts?: number;
  backoff?: number | BackoffOptions;
  delay?: number;
  jobId?: number | string;
  lifo?: boolean;
  priority?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
  repeat?: CronRepeatOptions | EveryRepeatOptions;
  stackTraceLimit?: number;
  timeout?: number;
}

export interface RepeatOptions {
  endDate?: Date | string | number;
  limit?: number;
  tz?: string;
}
