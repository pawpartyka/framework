import { Type } from './types/type';
import { Logger } from './logger';

export class LoggerFactory {
  protected static loggerRef: Type<Logger> = Logger;

  public static getLogger(context: string): Logger {
    return new this.loggerRef(context);
  }

  public static useLogger(loggerRef: Type<Logger>): void {
    this.loggerRef = loggerRef;
  }
}
