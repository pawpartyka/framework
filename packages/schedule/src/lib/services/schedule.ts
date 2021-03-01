import { Injectable } from '@artisanjs/core';
import { Job } from '../adapters/job';

@Injectable()
export class Schedule extends Array<Job> {
}
