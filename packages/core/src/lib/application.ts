import { Logger } from './logger';
import { Injector } from './injector';
import { Provider } from './types/provider';
import { LoggerFactory } from './logger-factory';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { OnApplicationInit, OnApplicationListen, OnApplicationShutdown } from './types/hooks';

export class Application {
  public static async create(options: ApplicationOptions): Promise<Application> {
    const logger: Logger = LoggerFactory.getLogger(Application.name);

    logger.info('Starting application...');

    const injector: Injector = await Injector.create(options.providers);

    return await new Application(options, injector, logger).init();
  }

  private readonly processOnListener = async (signal: string) => {
    await this.callOnApplicationShutdownHooks(signal);
    await this.unsubscribeProcessListeners();

    process.kill(process.pid, signal);
  };

  protected constructor(protected readonly applicationOptions: ApplicationOptions,
                        protected readonly injector: Injector,
                        protected readonly logger: Logger) {
  }

  public async filter(fn: (provider: Provider) => boolean): Promise<any[]> {
    return this.injector.filter(fn);
  }

  public async find<T>(fn: (provider: Provider) => boolean): Promise<T | undefined> {
    return this.injector.find(fn);
  }

  public async listen(): Promise<void> {
    await this.callOnApplicationListenHooks();
  }

  public async shutdown(): Promise<void> {
    await this.callOnApplicationShutdownHooks();
    this.unsubscribeProcessListeners();
  }

  protected async init(): Promise<Application> {
    this.subscribeProcessListeners();
    await this.callOnApplicationInitHooks();

    return this;
  }

  private async callOnApplicationInitHooks(): Promise<void> {
    for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
      if (typeof (provider as OnApplicationInit).onApplicationInit === 'function') {
        await provider.onApplicationInit();
      }
    }
  }

  private async callOnApplicationListenHooks(): Promise<void> {
    for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
      if (typeof (provider as OnApplicationListen).onApplicationListen === 'function') {
        await provider.onApplicationListen();
      }
    }
  }

  private async callOnApplicationShutdownHooks(signal?: string): Promise<void> {
    try {
      for (const provider of await this.filter(token => isTypeProvider(token) || isClassProvider(token))) {
        if (typeof (provider as OnApplicationShutdown).onApplicationShutdown === 'function') {
          await provider.onApplicationShutdown(signal);
        }
      }
    } catch (error) {
      this.logger.error('An error occurred while shutting down');

      process.exit(1);
    }
  }

  private subscribeProcessListeners(): void {
    for (const signal of this.applicationOptions.signals) {
      process.on(signal as any, this.processOnListener);
    }
  }

  private unsubscribeProcessListeners(): void {
    for (const signal of this.applicationOptions.signals) {
      process.removeListener(signal, this.processOnListener);
    }
  }
}

export interface ApplicationOptions {
  providers: Provider[];
  signals: string[];
}
