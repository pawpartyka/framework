import { EventsRegistry } from '../../src/lib/services/events-registry';

describe('EventsRegistry', () => {
  it('should extends Array', () => {
    expect(new EventsRegistry()).toBeInstanceOf(Array);
  });
});
