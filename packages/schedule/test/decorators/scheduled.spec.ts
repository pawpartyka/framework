import { Scheduled, SCHEDULED_METADATA, ScheduledMetadata } from '../../src/lib/decorators/scheduled';

describe('Scheduled', () => {
  it('should set the correct metadata on the descriptors', () => {
    class Foo {
      @Scheduled('* * * * 10')
      @Scheduled('* * * * 5', {
        timeZone: 'America/Los_Angeles',
        unrefTimeout: true,
        utcOffset: 1,
      })
      hello(): void {
      }

      @Scheduled('* * * * *')
      world(): void {
      }
    }

    const descriptors = Object.getOwnPropertyDescriptors(Foo.prototype);
    const helloMetadata: ScheduledMetadata = Reflect.getMetadata(SCHEDULED_METADATA, descriptors['hello'].value);
    const worldMetadata: ScheduledMetadata = Reflect.getMetadata(SCHEDULED_METADATA, descriptors['world'].value);

    expect(helloMetadata.length).toEqual(2);

    expect(helloMetadata[0].expression).toEqual('* * * * 5');
    expect(helloMetadata[0].timeZone).toEqual('America/Los_Angeles');
    expect(helloMetadata[0].unrefTimeout).toBeTruthy();
    expect(helloMetadata[0].utcOffset).toEqual(1);

    expect(helloMetadata[1].expression).toEqual('* * * * 10');
    expect(helloMetadata[1].timeZone).toBeUndefined();
    expect(helloMetadata[1].unrefTimeout).toBeUndefined();
    expect(helloMetadata[1].utcOffset).toBeUndefined();

    expect(worldMetadata.length).toEqual(1);

    expect(worldMetadata[0].expression).toEqual('* * * * *');
    expect(worldMetadata[0].timeZone).toBeUndefined();
    expect(worldMetadata[0].unrefTimeout).toBeUndefined();
    expect(worldMetadata[0].utcOffset).toBeUndefined();
  });
});
