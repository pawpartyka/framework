import { HttpStatus } from '@artisanjs/common';

export interface Response<R = any> {
  body: R;
  headers: { [header: string]: string; };
  status: HttpStatus;
  statusText: string;
}
