import clc from 'cli-color';
import { Injectable } from '../decorators/injectable.decorator';

function println(message: string, color: clc.Format): void {
  const datetime = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  process.stdout.write(`${ color(`[Artisan] ${ process.pid }`) } ${ color('-') } ${ datetime } ${ color('-') } ${ color(message) }\n`);
}

@Injectable()
export class Logger {
  public debug(message: string): void {
    println(message, clc.magentaBright);
  }

  public error(message: string): void {
    println(message, clc.redBright);
  }

  public info(message: string): void {
    println(message, clc.blueBright);
  }

  public trace(message: string): void {
    println(message, clc.green);
  }

  public warn(message: string): void {
    println(message, clc.yellowBright);
  }
}
