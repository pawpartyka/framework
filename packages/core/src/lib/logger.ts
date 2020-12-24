import clc from 'cli-color';

function println(message: string, context: string, color: clc.Format): void {
  const datetime = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  process.stdout.write(
    `${ color(`[Artisan] ${ process.pid }`) } ${ color('-') } ${ datetime } ${ clc.yellow(`[${ context }]`) } ${ color('-') } ${ color(message) }\n`,
  );
}

export class Logger {
  constructor(protected readonly context: string) {
  }

  public debug(message: string): void {
    println(message, this.context, clc.magentaBright);
  }

  public error(message: string): void {
    println(message, this.context, clc.redBright);
  }

  public info(message: string): void {
    println(message, this.context, clc.blueBright);
  }

  public trace(message: string): void {
    println(message, this.context, clc.green);
  }

  public warn(message: string): void {
    println(message, this.context, clc.yellowBright);
  }
}
