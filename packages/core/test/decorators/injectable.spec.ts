import { Injectable, INJECTABLE_METADATA } from '../../src/lib/decorators/injectable';

describe('Injectable', () => {
  it('should set the correct metadata on the class reference', () => {
    @Injectable()
    class Foo {
    }

    expect(Reflect.hasMetadata(INJECTABLE_METADATA, Foo)).toBe(true);
  });
});
