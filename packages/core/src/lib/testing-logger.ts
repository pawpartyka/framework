import { Logger } from './logger';

export class TestingLogger extends Logger {
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
