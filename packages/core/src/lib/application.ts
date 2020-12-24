import { Logger } from './logger';
import { Injector } from './injector';
import { Provider } from './types/provider';
import { LoggerFactory } from './logger-factory';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from './types/hooks';

export class Application {
  public static async create(options: ApplicationOptions): Promise<Application> {
    const logger: Logger = LoggerFactory.getLogger(Application.name);

    logger.info('Starting application...');

    const injector: Injector = await Injector.create(options.providers);

    return await new Application(injector, logger).init(options.signals);
  }

  protected constructor(
    protected readonly injector: Injector,
    protected readonly logger: Logger,
  ) {
  }

  public async filter(fn: (provider: Provider) => boolean): Promise<any[]> {
    return this.injector.filter(fn);
  }

  public async find<T>(fn: (provider: Provider) => boolean): Promise<T | undefined> {
    return this.injector.find(fn);
  }

  public async listen(): Promise<void> {
    for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
      if (typeof (provider as OnApplicationListen).onApplicationListen === 'function') {
        await provider.onApplicationListen();
      }
    }
  }

  protected async init(signals: string[]): Promise<Application> {
    const listener = async (signal: string) => {
      try {
        for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
          if (typeof (provider as OnApplicationShutdown).onApplicationShutdown === 'function') {
            await provider.onApplicationShutdown(signal);
          }
        }

        signals.forEach(it => {
          process.removeListener(it, listener);
        });

        process.kill(process.pid, signal);
      } catch (error) {
        this.logger.error('An error occurred while shutting down');

        process.exit(1);
      }
    };

    for (const signal of signals) {
      process.on(signal as any, listener);
    }

    for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
      if (typeof (provider as OnApplicationBoot).onApplicationBoot === 'function') {
        await provider.onApplicationBoot();
      }
    }

    return this;
  }
}

export interface ApplicationOptions {
  providers: Provider[];
  signals: string[];
}
