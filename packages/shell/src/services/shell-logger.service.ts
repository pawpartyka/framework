import { Injectable, Logger } from '@artisanjs/core';

@Injectable()
export class ShellLogger extends Logger {
  public debug(message: string): void {
    return;
  }

  public error(message: string): void {
    return;
  }

  public info(message: string): void {
    return;
  }

  public trace(message: string): void {
    return;
  }

  public warn(message: string): void {
    return;
  }
}
