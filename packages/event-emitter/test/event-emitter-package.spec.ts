import { Provider } from '@artisanjs/core';
import { EventEmitterPackage } from '../src/lib/event-emitter-package';
import { Emitter } from '../src/lib/services/emitter';
import { EventEmitterManager } from '../src/lib/event-emitter-manager';
import { EventsRegistry } from '../src/lib/services/events-registry';

describe('EventEmitterPackage', () => {
  const providers: Provider[] = EventEmitterPackage
    .configure()
    .register()
    .providers;

  it('should include the Emitter', async () => {
    expect(providers).toContain(Emitter);
  });

  it('should include the EventEmitterManager', async () => {
    expect(providers).toContain(EventEmitterManager);
  });

  it('should include the EventsRegistry', async () => {
    expect(providers).toContain(EventsRegistry);
  });
});
