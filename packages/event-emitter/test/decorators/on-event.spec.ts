import { ON_EVENT_METADATA, OnEvent, OnEventMetadata } from '../../src/lib/decorators/on-event';

describe('OnEvent', () => {
  it('should set the correct metadata on the descriptors', () => {
    class Engine {
      @OnEvent('engine.*')
      @OnEvent('engine.start')
      start(): void {
      }

      @OnEvent('engine.stop')
      stop(): void {
      }
    }

    const descriptors = Object.getOwnPropertyDescriptors(Engine.prototype);
    const startMetadata: OnEventMetadata = Reflect.getMetadata(ON_EVENT_METADATA, descriptors['start'].value);
    const stopMetadata: OnEventMetadata = Reflect.getMetadata(ON_EVENT_METADATA, descriptors['stop'].value);

    expect(startMetadata.length).toEqual(2);
    expect(startMetadata[0].event).toEqual('engine.start');
    expect(startMetadata[1].event).toEqual('engine.*');

    expect(stopMetadata.length).toEqual(1);
    expect(stopMetadata[0].event).toEqual('engine.stop');
  });
});
