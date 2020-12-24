import { isTypeProvider } from '../../src/lib/utils/is-type-provider';

describe('isTypeProvider', () => {
  it('should return false for a null', () => {
    expect(isTypeProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isTypeProvider(undefined)).toBe(false);
  });

  it('should return false for the object', () => {
    expect(isTypeProvider({})).toBe(false);
  });

  it('should return true for a class reference', () => {
    class Foo {
    }

    expect(isTypeProvider(Foo)).toBe(true);
  });
});
