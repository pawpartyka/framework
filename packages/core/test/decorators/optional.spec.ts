import { Optional, OPTIONAL_METADATA, OptionalMetadata } from '../../src/lib/decorators/optional';

describe('Optional', () => {
  it('should set the correct metadata on the class reference', () => {
    class Foo {
      constructor(
        bar: any,
        @Optional() baz: any,
        qux: any,
        @Optional() quz: any,
      ) {
      }
    }

    const metadata: OptionalMetadata = Reflect.getMetadata(OPTIONAL_METADATA, Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(1)).toBe(true);
    expect(metadata.get(3)).toBe(true);
  });
});
