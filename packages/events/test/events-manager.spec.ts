import { Injectable, Injector, Logger } from '@artisanjs/core';
import { OnEvent } from '../src/lib/decorators/on-event';
import { EventsRegistry } from '../src/lib/services/events-registry';
import { EventsManager } from '../src/lib/events-manager';

@Injectable()
class Engine {
  @OnEvent('engine.*')
  onEngineWildcard(): void {
  }

  @OnEvent('engine.start')
  onEngineStart(): void {
  }
}

@Injectable()
class User {
  @OnEvent('user.created')
  onUserCreated(): void {
  }
}

describe('EventsManager', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add event handlers to events registry on application init', async () => {
    const eventsRegistryPushSpy = jest.spyOn(EventsRegistry.prototype, 'push');
    const loggerInfoSpy = jest.spyOn(Logger.prototype, 'info');

    await new EventsManager(new EventsRegistry(), await Injector.create([Engine, User])).onApplicationInit();

    expect(eventsRegistryPushSpy).toHaveBeenCalledTimes(3);
    expect(eventsRegistryPushSpy).toHaveBeenCalledWith({ event: 'engine.*', handler: expect.any(Function) });
    expect(eventsRegistryPushSpy).toHaveBeenCalledWith({ event: 'engine.start', handler: expect.any(Function) });
    expect(eventsRegistryPushSpy).toHaveBeenCalledWith({ event: 'user.created', handler: expect.any(Function) });

    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {engine.*} event handler');
    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {engine.start} event handler');
    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {user.created} event handler');
  });
});
