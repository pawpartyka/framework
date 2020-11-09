import { getInjectMetadata, getOptionalMetadata, hasInjectableMetadata, Inject, Injectable, Optional } from './metadata';
import { forwardRef } from './utils';

describe('Inject metadata', () => {
  describe('getInjectMetadata', () => {
    it('should return undefined if the class does not use the Inject decorator', () => {
      class Foo {
      }

      expect(getInjectMetadata(Foo)).toBeUndefined();
    });

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

      const metadata = getInjectMetadata(Foo);

      expect(metadata.size).toBe(2);
      expect(metadata.get(1)).toBe(baz);
      expect(metadata.get(3)).toBe(quz);
    });
  });
});

describe('Injectable metadata', () => {
  describe('hasInjectableMetadata', () => {
    it('should return false if the class does not use the Injectable decorator', () => {
      class Foo {
      }

      expect(hasInjectableMetadata(Foo)).toBe(false);
    });

    it('should return true if the class uses the Injectable decorator', () => {
      @Injectable()
      class Foo {
      }

      expect(hasInjectableMetadata(Foo)).toBe(true);
    });
  });
});

describe('Optional metadata', () => {
  describe('getOptionalMetadata', () => {
    it('should return undefined if the class does not use the Optional decorator', () => {
      class Foo {
      }

      expect(getOptionalMetadata(Foo)).toBeUndefined();
    });

    it('should return correct optional metadata if the class uses the Optional decorator', () => {
      class Foo {
        constructor(
          bar: any,
          @Optional() baz: any,
          qux: any,
          @Optional() quz: any,
        ) {
        }
      }

      const metadata = getOptionalMetadata(Foo);

      expect(metadata.size).toBe(2);
      expect(metadata.get(1)).toBe(true);
      expect(metadata.get(3)).toBe(true);
    });
  });
});
