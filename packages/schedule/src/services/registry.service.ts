import { Injectable } from '@artisanjs/core';
import { CronJob } from 'cron';

@Injectable()
export class Registry extends Array<CronJob> {
}
