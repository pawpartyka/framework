import { Injectable, INJECTABLE_METADATA } from '../../src/lib/decorators/injectable';

describe('Injectable', () => {
  it('should have metadata if the class uses the Injectable decorator', () => {
    @Injectable()
    class Foo {
    }

    expect(Reflect.hasMetadata(INJECTABLE_METADATA, Foo)).toBe(true);
  });
});
