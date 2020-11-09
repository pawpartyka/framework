import { Logger } from '../logger';
import { Injectable } from '../metadata';

@Injectable()
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
