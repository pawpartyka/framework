import clc from 'cli-color';
import { Injectable } from '../decorators/injectable.decorator';
import { Optional } from '../decorators/optional.decorator';

@Injectable()
export class Logger {
  private static timestamp?: number;

  protected logLevels: LogLevel[] = [
    LogLevel.DEBUG,
    LogLevel.ERROR,
    LogLevel.INFO,
    LogLevel.LOG,
    LogLevel.WARN,
  ];

  constructor(@Optional() logLevels?: LogLevel[]) {
    if (logLevels) {
      this.logLevels = logLevels;
    }
  }

  public debug(message: string): void {
    this.write(LogLevel.DEBUG, message, clc.magentaBright);
  }

  public error(message: string): void {
    this.write(LogLevel.ERROR, message, clc.redBright);
  }

  public info(message: string): void {
    this.write(LogLevel.INFO, message, clc.blueBright);
  }

  public log(message: string): void {
    this.write(LogLevel.LOG, message, clc.green);
  }

  public warn(message: string): void {
    this.write(LogLevel.WARN, message, clc.yellowBright);
  }

  private write(logLevel: LogLevel, message: string, color: clc.Format): void {
    if (this.logLevels.includes(logLevel)) {
      const datetime = new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      const difference = Logger.timestamp ? clc.yellow(`+${ Date.now() - Logger.timestamp }ms`) : '';
      const separator = color('-');

      Logger.timestamp = Date.now();

      process.stdout.write(`${ color(`[Artisan] ${ process.pid }`) } ${ separator } ${ datetime } ${ separator } ${ color(message) } ${ difference }\n`);
    }
  }
}

export enum LogLevel {
  DEBUG,
  ERROR,
  INFO,
  LOG,
  WARN,
}
