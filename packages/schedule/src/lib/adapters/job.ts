import { CronJob, CronTime } from 'cron';

export class Job {
  private readonly cron: CronJob;

  public get name(): string {
    return this.options.name;
  }

  public get running(): boolean {
    return this.cron.running;
  }

  constructor(protected readonly options: JobOptions) {
    this.cron = new CronJob(
      options.expression, options.callback, null, false, options.timeZone, null, false, options.utcOffset, options.unrefTimeout,
    );
  }

  public start(): void {
    this.cron.start();
  }

  public stop(): void {
    this.cron.stop();
  }

  public setTime(source: string | Date, timeZone?: string, utcOffset?: string | number): void {
    this.cron.setTime(new CronTime(source, timeZone, utcOffset));
  }

  public lastDate(): Date | undefined {
    return this.cron.lastDate();
  }

  public nextDates(count?: number): Date | Date[] | undefined {
    const result = this.cron.nextDates(count);

    return Array.isArray(result) ? result.map(it => it.toDate()) : result?.toDate();
  }
}

export interface JobOptions {
  callback: () => any;
  expression: string;
  name: string;
  timeZone?: string;
  unrefTimeout?: boolean;
  utcOffset?: string | number;
}
