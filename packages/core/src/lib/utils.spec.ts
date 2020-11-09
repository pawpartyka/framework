import {
  ForwardRef,
  forwardRef,
  getProviderDependencies,
  getProviderName,
  getProviderToken,
  getTokenName,
  isClassProvider,
  isExistingProvider,
  isFactoryProvider,
  isForwardRef,
  isMultiProvider,
  isTypeProvider,
  isValueProvider,
  Token,
} from './utils';
import { Inject, Injectable, Optional } from './metadata';

describe('forwardRef', () => {
  it('should return ForwardRef', async () => {
    const fn = () => 'foo';

    expect(forwardRef(fn)).toEqual({ forwardRef: fn });
  });
});

describe('getProviderDependencies', () => {
  it('should throw exception for the class provider without Injectable annotation', () => {
    class Foo {
    }

    expect(() => getProviderDependencies({ provide: 'foo', useClass: Foo })).toThrow(`The '${ Foo.name }' should be annotated as a injectable`);
  });

  it('should return correct provider dependencies for the class provider', () => {
    @Injectable()
    class Bar {
    }

    expect(getProviderDependencies({ provide: 'bar', useClass: Bar })).toEqual([]);

    @Injectable()
    class Foo {
      constructor(
        arg1: Bar,
        @Optional() arg2: Bar,
        @Inject('bar') arg3: Bar,
        @Inject('bar') @Optional() arg4: Bar,
        @Inject(forwardRef(() => 'bar')) arg5: Bar,
        @Inject(forwardRef(() => 'bar')) @Optional() arg6: Bar,
        @Inject('baz') arg7: any,
        @Inject('baz') @Optional() arg8: any,
        @Inject(forwardRef(() => 'baz')) arg9: any,
        @Inject(forwardRef(() => 'baz')) @Optional() arg10: any,
      ) {
      }
    }

    expect(getProviderDependencies({ provide: 'foo', useClass: Foo })).toEqual([
      { dependency: Bar, optional: false },
      { dependency: Bar, optional: true },
      { dependency: 'bar', optional: false },
      { dependency: 'bar', optional: true },
      { dependency: 'bar', optional: false },
      { dependency: 'bar', optional: true },
      { dependency: 'baz', optional: false },
      { dependency: 'baz', optional: true },
      { dependency: 'baz', optional: false },
      { dependency: 'baz', optional: true },
    ]);
  });

  it('should return correct provider dependencies for the factory provider', () => {
    expect(getProviderDependencies({ provide: 'lorem', useFactory: () => null })).toEqual([]);
    expect(getProviderDependencies({ dependencies: [], provide: 'lorem', useFactory: () => null })).toEqual([]);
    expect(getProviderDependencies({
      dependencies: ['foo', { dependency: 'bar', optional: true }, 'baz', { dependency: 'qux', optional: false }],
      provide: 'lorem',
      useFactory: () => null,
    })).toEqual([
      { dependency: 'foo', optional: false },
      { dependency: 'bar', optional: true },
      { dependency: 'baz', optional: false },
      { dependency: 'qux', optional: false },
    ]);
  });

  it('should throw exception for the type provider without Injectable annotation', () => {
    class Foo {
    }

    expect(() => getProviderDependencies(Foo)).toThrow(`The '${ Foo.name }' should be annotated as a injectable`);
  });

  it('should return correct provider dependencies for the type provider', () => {
    @Injectable()
    class Bar {
    }

    expect(getProviderDependencies(Bar)).toEqual([]);

    @Injectable()
    class Foo {
      constructor(
        arg1: Bar,
        @Optional() arg2: Bar,
        @Inject('bar') arg3: Bar,
        @Inject('bar') @Optional() arg4: Bar,
        @Inject(forwardRef(() => 'bar')) arg5: Bar,
        @Inject(forwardRef(() => 'bar')) @Optional() arg6: Bar,
        @Inject('baz') arg7: any,
        @Inject('baz') @Optional() arg8: any,
        @Inject(forwardRef(() => 'baz')) arg9: any,
        @Inject(forwardRef(() => 'baz')) @Optional() arg10: any,
      ) {
      }
    }

    expect(getProviderDependencies(Foo)).toEqual([
      { dependency: Bar, optional: false },
      { dependency: Bar, optional: true },
      { dependency: 'bar', optional: false },
      { dependency: 'bar', optional: true },
      { dependency: 'bar', optional: false },
      { dependency: 'bar', optional: true },
      { dependency: 'baz', optional: false },
      { dependency: 'baz', optional: true },
      { dependency: 'baz', optional: false },
      { dependency: 'baz', optional: true },
    ]);
  });
});

describe('getProviderName', () => {
  it('should return correct provider name for a class provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    class Lorem {
    }

    expect(getProviderName({ provide: Foo, useClass: Lorem })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useClass: Lorem })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useClass: Lorem })).toBe(baz.toString());
  });

  it('should return correct provider name for an existing provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useExisting: 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useExisting: 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useExisting: 'lorem' })).toBe(baz.toString());
  });

  it('should return correct provider name for a factory provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useFactory: () => 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useFactory: () => 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useFactory: () => 'lorem' })).toBe(baz.toString());
  });

  it('should return correct provider name for a type provider', () => {
    class Foo {
    }

    expect(getProviderName(Foo)).toBe(Foo.name);
  });

  it('should return correct provider name for a value provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderName({ provide: Foo, useValue: 'lorem' })).toBe(Foo.name);
    expect(getProviderName({ provide: bar, useValue: 'lorem' })).toBe(bar.toString());
    expect(getProviderName({ provide: baz, useValue: 'lorem' })).toBe(baz.toString());
  });
});

describe('getProviderToken', () => {
  it('should return correct provider token for a class provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    class Lorem {
    }

    expect(getProviderToken({ provide: Foo, useClass: Lorem })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useClass: Lorem })).toBe(bar);
    expect(getProviderToken({ provide: baz, useClass: Lorem })).toBe(baz);
  });

  it('should return correct provider token for an existing provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useExisting: 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useExisting: 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useExisting: 'lorem' })).toBe(baz);
  });

  it('should return correct provider token for a factory provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useFactory: () => 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useFactory: () => 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useFactory: () => 'lorem' })).toBe(baz);
  });

  it('should return correct provider token for a type provider', () => {
    class Foo {
    }

    expect(getProviderToken(Foo)).toBe(Foo);
  });

  it('should return correct provider token for a value provider', () => {
    class Foo {
    }

    const bar: Token = 'bar';
    const baz: Token = Symbol('baz');

    expect(getProviderToken({ provide: Foo, useValue: 'lorem' })).toBe(Foo);
    expect(getProviderToken({ provide: bar, useValue: 'lorem' })).toBe(bar);
    expect(getProviderToken({ provide: baz, useValue: 'lorem' })).toBe(baz);
  });
});

describe('getTokenName', () => {
  it('should return correct token name for a string token', () => {
    const foo: Token = 'foo';

    expect(getTokenName(foo)).toBe(foo.toString());
  });

  it('should return correct token name for a symbol token', () => {
    const foo: Token = Symbol('foo');

    expect(getTokenName(foo)).toBe(foo.toString());
  });

  it('should return correct token name for a Type token', () => {
    class Foo {
    }

    expect(getTokenName(Foo)).toBe(Foo.name);
  });
});

describe('isClassProvider', () => {
  it('should return false for a null', () => {
    expect(isClassProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isClassProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isClassProvider({})).toBe(false);
  });

  it('should return true for object with useClass property', () => {
    expect(isClassProvider({ useClass: 'foo' })).toBe(true);
  });
});

describe('isExistingProvider', () => {
  it('should return false for a null', () => {
    expect(isExistingProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isExistingProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isExistingProvider({})).toBe(false);
  });

  it('should return true for object with useExisting property', () => {
    expect(isExistingProvider({ useExisting: 'foo' })).toBe(true);
  });
});

describe('isFactoryProvider', () => {
  it('should return false for a null', () => {
    expect(isFactoryProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isFactoryProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isFactoryProvider({})).toBe(false);
  });

  it('should return true for object with useFactory property', () => {
    expect(isFactoryProvider({ useFactory: () => 'foo' })).toBe(true);
  });
});

describe('isForwardRef', () => {
  it('should return false for a null', () => {
    expect(isForwardRef(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isForwardRef(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isForwardRef({})).toBe(false);
  });

  it('should return true for a ForwardRef', async () => {
    const result: ForwardRef = forwardRef(() => 'foo');

    expect(isForwardRef(result)).toBe(true);
  });
});

describe('isMultiProvider', () => {
  it('should return false for a null', () => {
    expect(isMultiProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isMultiProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isMultiProvider({})).toBe(false);
  });

  it('should return true for object with multi property', () => {
    expect(isMultiProvider({ multi: true })).toBe(true);
    expect(isMultiProvider({ multi: false })).toBe(true);
  });
});

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

describe('isValueProvider', () => {
  it('should return false for a null', () => {
    expect(isValueProvider(null)).toBe(false);
  });

  it('should return false for an undefined', () => {
    expect(isValueProvider(undefined)).toBe(false);
  });

  it('should return false for an empty object', () => {
    expect(isValueProvider({})).toBe(false);
  });

  it('should return true for object with useValue property', () => {
    expect(isValueProvider({ useValue: 'bar' })).toBe(true);
  });
});
