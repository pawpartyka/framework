import { Provider } from '@artisanjs/core';
import { EventsPackage } from '../src/lib/events-package';
import { Emitter } from '../src/lib/services/emitter';
import { EventsManager } from '../src/lib/events-manager';
import { EventsRegistry } from '../src/lib/services/events-registry';

describe('EventsPackage', () => {
  const providers: Provider[] = EventsPackage
    .configure()
    .register()
    .providers;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should include the Emitter', async () => {
    expect(providers).toContain(Emitter);
  });

  it('should include the EventsManager', async () => {
    expect(providers).toContain(EventsManager);
  });

  it('should include the EventsRegistry', async () => {
    expect(providers).toContain(EventsRegistry);
  });
});
