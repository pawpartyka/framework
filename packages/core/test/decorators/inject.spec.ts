import { forwardRef } from '../../src/lib/utils/forward-ref';
import { Inject, INJECT_METADATA, InjectMetadata } from '../../src/lib/decorators/inject';

describe('Inject', () => {
  it('should return correct inject metadata if the class uses the Inject decorator', () => {
    const baz = 'bar';
    const quz = forwardRef(() => 'baz');

    class Foo {
      constructor(
        bar: any,
        @Inject(baz) baz: any,
        qux: any,
        @Inject(quz) quz: any,
      ) {
      }
    }

    const metadata: InjectMetadata = Reflect.getMetadata(INJECT_METADATA, Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(1)).toBe(baz);
    expect(metadata.get(3)).toBe(quz);
  });
});
