import { Artisan } from '../src/lib/artisan';
import { Injector } from '../src/lib/injector';
import { Application } from '../src/lib/application';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '../src/lib/types/hooks';
import { Injectable } from '../src/lib/decorators/injectable';
import { Logger } from '../src/lib/logger';
import { LoggerFactory } from '../src/lib/logger-factory';
import { Provider } from '../src/lib/types/provider';

@Injectable()
class Engine implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  onApplicationBoot(): void {
    return;
  }

  onApplicationListen(): void {
    return;
  }

  onApplicationShutdown(signal: string): void {
    return;
  }
}

@Injectable()
class Car implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(public engine: Engine) {
  }

  onApplicationBoot(): void {
    return;
  }

  onApplicationListen(): void {
    return;
  }

  onApplicationShutdown(signal: string): void {
    return;
  }
}

describe('Artisan', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly set logger in LoggerFactory', async () => {
    class SampleLogger extends Logger {
    }

    const useLoggerSpy = jest.spyOn(LoggerFactory, 'useLogger').mockImplementation(jest.fn());

    Artisan
      .configureApplication()
      .useLogger(SampleLogger);

    expect(useLoggerSpy).toHaveBeenNthCalledWith(1, SampleLogger);
  });

  it('should correctly pass providers to Injector', async () => {
    const createSpy = jest.spyOn(Injector, 'create');
    const providers1: Provider[] = [{ provide: 'foo', useValue: 'foo' }];
    const providers2: Provider[] = [{ provide: 'bar', useValue: 'bar' }];

    await Artisan
      .configureApplication({
        packages: [
          { providers: providers1 },
        ],
        providers: providers2,
      })
      .compile();

    expect(createSpy).toHaveBeenNthCalledWith(1, [...providers1, ...providers2]);
  });

  it('should correctly resolve the same provider by priority', async () => {
    const providers1: Provider[] = [{ provide: 'foo', useValue: 1 }];
    const providers2: Provider[] = [{ provide: 'foo', useValue: 2 }];

    {
      const application = await Artisan
        .configureApplication({
          providers: [
            ...providers1,
            ...providers2,
          ],
        })
        .compile();

      expect(await application.find('foo')).toEqual(2);
    }

    {
      const application = await Artisan
        .configureApplication({
          packages: [
            { providers: providers1 },
            { providers: providers2 },
          ],
        })
        .compile();

      expect(await application.find('foo')).toEqual(2);
    }

    {
      const application = await Artisan
        .configureApplication({
          packages: [
            { providers: providers1 },
          ],
          providers: providers2,
        })
        .compile();

      expect(await application.find('foo')).toEqual(2);
    }
  });

  it('should correctly enable signals for shutdown hooks', async () => {
    const createSpy = jest.spyOn(Application, 'create');
    const processOnSpy = jest.spyOn(process, 'on').mockImplementation(jest.fn());

    await Artisan
      .configureApplication()
      .enableShutdownHooks(['SIGTERM', 'SIGTERM'])
      .enableShutdownHooks(['SIGKILL'])
      .compile();

    expect(createSpy).toHaveBeenNthCalledWith(1, { providers: [], signals: ['SIGTERM', 'SIGKILL'] });
    expect(processOnSpy).toHaveBeenCalledTimes(2);
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(processOnSpy).toHaveBeenCalledWith('SIGKILL', expect.any(Function));
  });

  it('should invoke hooks in the correct sequence', async () => {
    const processKillSpy = jest.spyOn(process, 'kill').mockImplementation(jest.fn());

    const engineOnApplicationBootSpy = jest.spyOn(Engine.prototype, 'onApplicationBoot');
    const engineOnApplicationListenSpy = jest.spyOn(Engine.prototype, 'onApplicationListen');
    const engineOnApplicationShutdownSpy = jest.spyOn(Engine.prototype, 'onApplicationShutdown');

    const carOnApplicationBootSpy = jest.spyOn(Car.prototype, 'onApplicationBoot');
    const carOnApplicationListenSpy = jest.spyOn(Car.prototype, 'onApplicationListen');
    const carOnApplicationShutdownSpy = jest.spyOn(Car.prototype, 'onApplicationShutdown');

    const application = await Artisan
      .configureApplication({
        packages: [
          { providers: [Engine] },
        ],
        providers: [
          { provide: Car, useClass: Car },
        ],
      })
      .enableShutdownHooks(['SIGTERM'])
      .compile();

    expect(engineOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(0);
    expect(engineOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(carOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(0);
    expect(carOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    await application.listen();

    expect(engineOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(carOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    process.emit('SIGTERM', 'SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(engineOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationShutdownSpy).toHaveBeenCalledTimes(1);

    expect(carOnApplicationBootSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationShutdownSpy).toHaveBeenCalledTimes(1);

    expect(processKillSpy).toHaveBeenNthCalledWith(1, process.pid, 'SIGTERM');
  });

  it('should terminate the process if the OnApplicationShutdown hook throws an exception', async () => {
    const processExitSpy = jest.spyOn<any, any>(process, 'exit').mockImplementation(jest.fn());

    @Injectable()
    class Sample implements OnApplicationShutdown {
      onApplicationShutdown(signal: string): void {
        throw Error();
      }
    }

    await Artisan
      .configureApplication({
        providers: [Sample],
      })
      .enableShutdownHooks(['SIGTERM'])
      .compile();

    process.emit('SIGTERM', 'SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(processExitSpy).toHaveBeenNthCalledWith(1, 1);
  });

  it('should correctly call filter method in Injector', async () => {
    const application = await Artisan.configureApplication().compile();
    const filterSpy = jest.spyOn(Injector.prototype, 'filter');

    function fn() {
      return true;
    }

    await application.filter(fn);

    expect(filterSpy).toHaveBeenNthCalledWith(1, fn);
  });

  it('should correctly call find method in Injector', async () => {
    const application = await Artisan.configureApplication().compile();
    const findSpy = jest.spyOn(Injector.prototype, 'find');

    await application.find('foo', 'bar');

    expect(findSpy).toHaveBeenNthCalledWith(1, 'foo', 'bar');
  });
});
