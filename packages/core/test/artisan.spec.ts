import { Artisan } from '../src/lib/artisan';
import { Injector } from '../src/lib/injector';
import { OnApplicationInit, OnApplicationListen, OnApplicationShutdown } from '../src/lib/types/hooks';
import { Injectable } from '../src/lib/decorators/injectable';
import { Logger } from '../src/lib/logger';
import { LoggerFactory } from '../src/lib/logger-factory';
import { Provider } from '../src/lib/types/provider';
import { getProviderToken } from '../src/lib/utils/get-provider-token';
import { Application } from '../src/lib/application';

@Injectable()
class Engine implements OnApplicationInit, OnApplicationListen, OnApplicationShutdown {
  onApplicationInit(): void {
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
class BrokenEngine extends Engine {
  onApplicationShutdown(signal: string): void {
    throw Error();
  }
}

@Injectable()
class Car implements OnApplicationInit, OnApplicationListen, OnApplicationShutdown {
  constructor(public engine: Engine) {
  }

  onApplicationInit(): void {
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

  it('should call filter method in Injector', async () => {
    const application = await Artisan.configureApplication().compile();
    const injectorFilterSpy = jest.spyOn(Injector.prototype, 'filter');

    function fn() {
      return true;
    }

    await application.filter(fn);

    expect(injectorFilterSpy).toHaveBeenNthCalledWith(1, fn);
  });

  it('should call find method in Injector', async () => {
    const application = await Artisan.configureApplication().compile();
    const injectorFindSpy = jest.spyOn(Injector.prototype, 'find');

    function fn(provider: Provider) {
      return getProviderToken(provider) === 'foo';
    }

    await application.find(fn);

    expect(injectorFindSpy).toHaveBeenNthCalledWith(1, fn);
  });

  it('should set logger in LoggerFactory', async () => {
    class SampleLogger extends Logger {
    }

    const useLoggerSpy = jest.spyOn(LoggerFactory, 'useLogger').mockImplementation(jest.fn());

    Artisan
      .configureApplication()
      .useLogger(SampleLogger);

    expect(useLoggerSpy).toHaveBeenNthCalledWith(1, SampleLogger);
  });

  it('should pass providers to Injector', async () => {
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

  it('should resolve the same provider by priority', async () => {
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

      expect(await application.find(provider => getProviderToken(provider) === 'foo')).toEqual(2);
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

      expect(await application.find(provider => getProviderToken(provider) === 'foo')).toEqual(2);
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

      expect(await application.find(provider => getProviderToken(provider) === 'foo')).toEqual(2);
    }
  });

  it('should enable only unique signals', async () => {
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
    const engineOnApplicationInitSpy = jest.spyOn(Engine.prototype, 'onApplicationInit');
    const engineOnApplicationListenSpy = jest.spyOn(Engine.prototype, 'onApplicationListen');
    const engineOnApplicationShutdownSpy = jest.spyOn(Engine.prototype, 'onApplicationShutdown');

    const carOnApplicationInitSpy = jest.spyOn(Car.prototype, 'onApplicationInit');
    const carOnApplicationListenSpy = jest.spyOn(Car.prototype, 'onApplicationListen');
    const carOnApplicationShutdownSpy = jest.spyOn(Car.prototype, 'onApplicationShutdown');

    const processRemoveListenerSpy = jest.spyOn(process, 'removeListener');

    const signals = ['SIGTERM', 'SIGINT'];

    const application = await Artisan
      .configureApplication({
        providers: [Engine, Car],
      })
      .enableShutdownHooks(signals)
      .compile();

    expect(engineOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(0);
    expect(engineOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(carOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(0);
    expect(carOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(processRemoveListenerSpy).not.toHaveBeenCalled();

    await application.listen();

    expect(engineOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(carOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationShutdownSpy).toHaveBeenCalledTimes(0);

    expect(processRemoveListenerSpy).not.toHaveBeenCalled();

    await application.shutdown();

    expect(engineOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(engineOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, undefined);

    expect(carOnApplicationInitSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationListenSpy).toHaveBeenCalledTimes(1);
    expect(carOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, undefined);

    expect(processRemoveListenerSpy).toHaveBeenCalledTimes(signals.length);
    expect(processRemoveListenerSpy).toHaveBeenCalledWith(signals[0], expect.any(Function));
    expect(processRemoveListenerSpy).toHaveBeenCalledWith(signals[1], expect.any(Function));
  });

  it('should invoke shutdown hooks if the process emits an enabled signal', async () => {
    const engineOnApplicationShutdownSpy = jest.spyOn(Engine.prototype, 'onApplicationShutdown');
    const removeListenerSpy = jest.spyOn(process, 'removeListener');
    const processKillSpy = jest.spyOn(process, 'kill').mockImplementation(jest.fn());

    await Artisan
      .configureApplication({
        providers: [Engine],
      })
      .enableShutdownHooks(['SIGTERM'])
      .compile();

    expect(engineOnApplicationShutdownSpy).not.toHaveBeenCalled();
    expect(removeListenerSpy).not.toHaveBeenCalled();
    expect(processKillSpy).not.toHaveBeenCalled();

    process.emit('SIGTERM', 'SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(engineOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, 'SIGTERM');
    expect(removeListenerSpy).toHaveBeenNthCalledWith(1, 'SIGTERM', expect.any(Function));
    expect(processKillSpy).toHaveBeenNthCalledWith(1, process.pid, 'SIGTERM');
  });

  it('should not invoke shutdown hooks if the process emits the disabled signal', async () => {
    const engineOnApplicationShutdownSpy = jest.spyOn(Engine.prototype, 'onApplicationShutdown');
    const removeListenerSpy = jest.spyOn(process, 'removeListener');
    const processKillSpy = jest.spyOn(process, 'kill').mockImplementation(jest.fn());

    await Artisan
      .configureApplication({
        providers: [Engine],
      })
      .compile();

    process.emit('SIGTERM', 'SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(engineOnApplicationShutdownSpy).not.toHaveBeenCalled();
    expect(removeListenerSpy).not.toHaveBeenCalled();
    expect(processKillSpy).not.toHaveBeenCalled();
  });

  it('should exit the process if the shutdown method is called and then OnApplicationShutdown hook throws an exception', async () => {
    const brokenEngineOnApplicationShutdownSpy = jest.spyOn(BrokenEngine.prototype, 'onApplicationShutdown');
    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');
    const processExitSpy = jest.spyOn<any, any>(process, 'exit').mockImplementation(jest.fn());

    const application = await Artisan
      .configureApplication({
        providers: [BrokenEngine],
      })
      .compile();

    await application.shutdown();

    expect(brokenEngineOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, undefined);
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'An error occurred while shutting down');
    expect(processExitSpy).toHaveBeenNthCalledWith(1, 1);
  });

  it('should exit the process if the process emits enabled signal and then OnApplicationShutdown hook throws an exception', async () => {
    jest.spyOn(process, 'kill').mockImplementation(jest.fn());

    const brokenEngineOnApplicationShutdownSpy = jest.spyOn(BrokenEngine.prototype, 'onApplicationShutdown');
    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');
    const processExitSpy = jest.spyOn<any, any>(process, 'exit').mockImplementation(jest.fn());

    await Artisan
      .configureApplication({
        providers: [BrokenEngine],
      })
      .enableShutdownHooks(['SIGTERM'])
      .compile();

    process.emit('SIGTERM', 'SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(brokenEngineOnApplicationShutdownSpy).toHaveBeenNthCalledWith(1, 'SIGTERM');
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'An error occurred while shutting down');
    expect(processExitSpy).toHaveBeenNthCalledWith(1, 1);
  });
});
