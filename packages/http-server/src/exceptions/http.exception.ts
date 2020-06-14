import { HttpStatus } from '@artisanjs/common';
import statuses from 'statuses';

export class HttpException extends Error {
  public readonly reason: object | string;
  public readonly status: HttpStatus;

  constructor(status: HttpStatus, reason?: object | string) {
    super();

    this.reason = reason ? reason : statuses.message[status];
    this.status = status;
  }

  public getResponse(): object {
    return typeof this.reason === 'object' ? this.reason : {
      code: this.status,
      message: this.reason,
    };
  }

  public getStatus(): HttpStatus {
    return this.status;
  }
}
