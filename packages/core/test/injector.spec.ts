import { Injector } from '../src/lib/injector';
import { Injectable } from '../src/lib/decorators/injectable';
import { Inject } from '../src/lib/decorators/inject';
import { Optional } from '../src/lib/decorators/optional';
import { forwardRef } from '../src/lib/utils/forward-ref';
import { getTokenName } from '../src/lib/utils/get-token-name';
import { getProviderToken } from '../src/lib/utils/get-provider-token';

class CarWithoutInjectableAnnotation {
}

@Injectable()
class Engine {
}

@Injectable()
class Car {
  constructor(public engine: Engine) {
  }
}

@Injectable()
class CarWithUnknownEngine {
  constructor(public engine: any) {
  }
}

@Injectable()
class CarWithOptionalEngine {
  constructor(@Optional() public engine: Engine) {
  }
}

@Injectable()
class CarWithInjectEngine {
  constructor(@Inject(Engine) public engine: any) {
  }
}

@Injectable()
class CarWithInjectEngineByForwardRef {
  constructor(@Inject(forwardRef(() => Engine)) public engine: any) {
  }
}

@Injectable()
class CarWithOptionalInjectEngine {
  constructor(@Optional() @Inject(Engine) public engine: any) {
  }
}

@Injectable()
class CarWithOptionalInjectEngineByForwardRef {
  constructor(@Optional() @Inject(forwardRef(() => Engine)) public engine: any) {
  }
}

describe('Injector', () => {
  it('should contain built-in Injector dependency', async () => {
    const injector = await Injector.create([]);

    expect(await injector.find(provider => getProviderToken(provider) === Injector)).toBe(injector);
  });

  it('should correctly resolve the same provider by priority', async () => {
    const injector = await Injector.create([
      { provide: 'foo', useValue: 1 },
      { provide: 'foo', useValue: 2 },
    ]);

    expect(await injector.find(provider => getProviderToken(provider) === 'foo')).toEqual(1);
  });

  describe('filter method', () => {
    it('should return properly filtered providers', async () => {
      const injector = await Injector.create([
        { provide: 'foo', useValue: 1 },
        { provide: 'bar', useValue: 2 },
        { provide: 'baz', useValue: 3 },
      ]);

      const result: any[] = await injector.filter(provider => {
        const token = getProviderToken(provider);

        return token === 'foo' || token === 'bar';
      });

      expect(result.length).toEqual(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).not.toContain(3);
    });
  });

  describe('find method', () => {
    it('should return the found provider', async () => {
      const injector = await Injector.create([]);

      expect(await injector.find(provider => getProviderToken(provider) === Injector)).toBe(injector);
    });

    it('should return undefined if the provider is not found', async () => {
      const injector = await Injector.create([]);

      expect(await injector.find(provider => getProviderToken(provider) === 'car')).toBeUndefined();
    });
  });

  describe('using class providers', () => {
    it('should throw an exception if the class does not have the Injection annotation', () => {
      expect(Injector.create([{ provide: 'car', useClass: CarWithoutInjectableAnnotation }]))
        .rejects
        .toThrowError(`The '${ getTokenName(CarWithoutInjectableAnnotation) }' should be annotated as a injectable`);
    });

    it('should correctly resolve class without dependencies', async () => {
      const injector = await Injector.create([{ provide: 'engine', useClass: Engine }]);

      expect(await injector.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference dependency', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: Car }]);
      const car = await injector.find<Car>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(Car);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class injects a nonexistent reference dependency', () => {
      expect(Injector.create([{ provide: 'car', useClass: Car }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(Car) }`);
    });

    it('should throw an exception if the class injects an unknown reference dependency', () => {
      expect(Injector.create([{ provide: 'car', useClass: CarWithUnknownEngine }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithUnknownEngine) }`);
    });

    it('should correctly resolve class with reference optional dependency', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: CarWithOptionalEngine }]);
      const car = await injector.find<CarWithOptionalEngine>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference optional nonexistent dependency', async () => {
      const injector = await Injector.create([{ provide: 'car', useClass: CarWithOptionalEngine }]);
      const car = await injector.find<CarWithOptionalEngine>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with dependency by Inject annotation', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: CarWithInjectEngine }]);
      const car = await injector.find<CarWithInjectEngine>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation', () => {
      expect(Injector.create([{ provide: 'car', useClass: CarWithInjectEngine }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngine) }`);
    });

    it('should correctly resolve class with dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: CarWithInjectEngineByForwardRef }]);
      const car = await injector.find<CarWithInjectEngineByForwardRef>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation and forwardRef', () => {
      expect(Injector.create([{ provide: 'car', useClass: CarWithInjectEngineByForwardRef }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngineByForwardRef) }`);
    });

    it('should correctly resolve class with optional dependency by Inject annotation', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: CarWithOptionalInjectEngine }]);
      const car = await injector.find<CarWithOptionalInjectEngine>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation', async () => {
      const injector = await Injector.create([{ provide: 'car', useClass: CarWithOptionalInjectEngine }]);
      const car = await injector.find<CarWithOptionalInjectEngine>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with optional dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([Engine, { provide: 'car', useClass: CarWithOptionalInjectEngineByForwardRef }]);
      const car = await injector.find<CarWithOptionalInjectEngineByForwardRef>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([{ provide: 'car', useClass: CarWithOptionalInjectEngineByForwardRef }]);
      const car = await injector.find<CarWithOptionalInjectEngineByForwardRef>(provider => getProviderToken(provider) === 'car');

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeUndefined();
    });
  });

  describe('using existing providers', () => {
    it('should correctly resolve provider', async () => {
      const injector = await Injector.create([
        Engine,
        { provide: 'alias', useExisting: Engine },
      ]);

      expect(await injector.find(provider => getProviderToken(provider) === 'alias'))
        .toBe(await injector.find(provider => getProviderToken(provider) === Engine));
    });

    it('should throw an exception if a non provider is passed', () => {
      expect(Injector.create([{ provide: 'engine', useExisting: Engine }]))
        .rejects
        .toThrowError(`No provider for ${ getTokenName(Engine) }!`);
    });

    it('should throw an exception if an provider points to itself', () => {
      expect(Injector.create([{ provide: Engine, useExisting: Engine }]))
        .rejects
        .toThrowError(`Cannot instantiate cyclic dependency for token ${ getTokenName(Engine) }!`);
    });
  });

  describe('using factory providers', () => {
    it('should correctly resolve provider without dependencies', async () => {
      const injector = await Injector.create([
        { provide: 'car', useFactory: () => 'foo' },
      ]);

      expect(await injector.find(provider => getProviderToken(provider) === 'car')).toEqual('foo');
    });

    it('should correctly resolve async provider without dependencies', async () => {
      const injector = await Injector.create([
        { provide: 'car', useFactory: () => new Promise(resolve => setTimeout(() => resolve('foo'), 10)) },
      ]);

      expect(await injector.find(provider => getProviderToken(provider) === 'car')).toEqual('foo');
    });

    it('should correctly resolve provider with dependency', async () => {
      const injector = await Injector.create([
        Engine,
        { provide: 'car1', useFactory: engine => ({ engine }), dependencies: [Engine] },
        { provide: 'car2', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: false }] },
      ]);

      const car1 = await injector.find<{ engine: Engine }>(provider => getProviderToken(provider) === 'car1');
      const car2 = await injector.find<{ engine: Engine }>(provider => getProviderToken(provider) === 'car2');

      expect(car1.engine).toBeInstanceOf(Engine);
      expect(car2.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve provider with optional dependency', async () => {
      const injector = await Injector.create([
        Engine,
        { provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: true }] },
      ]);
      const car = await injector.find<{ engine: Engine }>(provider => getProviderToken(provider) === 'car');

      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve provider with nonexistent optional dependency', async () => {
      const injector = await Injector.create([
        { provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: true }] },
      ]);
      const car = await injector.find<{ engine: Engine }>(provider => getProviderToken(provider) === 'car');

      expect(car.engine).toBeUndefined();
    });

    it('should throw an exception if the provider injects a nonexistent dependency', () => {
      expect(Injector.create([{ provide: 'car', useFactory: engine => ({ engine }), dependencies: [Engine] }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName('car') }`);

      expect(Injector.create([{ provide: 'car', useFactory: engine => ({ engine }), dependencies: [{ dependency: Engine, optional: false }] }]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName('car') }`);
    });
  });

  describe('using type providers', () => {
    it('should throw an exception if the class does not have the Injection annotation', () => {
      expect(Injector.create([CarWithoutInjectableAnnotation]))
        .rejects
        .toThrowError(`The '${ getTokenName(CarWithoutInjectableAnnotation) }' should be annotated as a injectable`);
    });

    it('should correctly resolve class without dependencies', async () => {
      const injector = await Injector.create([Engine]);

      expect(await injector.find(provider => getProviderToken(provider) === Engine)).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference dependency', async () => {
      const injector = await Injector.create([Engine, Car]);
      const car = await injector.find<Car>(provider => getProviderToken(provider) === Car);

      expect(car).toBeInstanceOf(Car);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class injects a nonexistent reference dependency', () => {
      expect(Injector.create([Car]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(Car) }`);
    });

    it('should throw an exception if the class injects an unknown reference dependency', () => {
      expect(Injector.create([CarWithUnknownEngine]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithUnknownEngine) }`);
    });

    it('should correctly resolve class with reference optional dependency', async () => {
      const injector = await Injector.create([Engine, CarWithOptionalEngine]);
      const car = await injector.find<CarWithOptionalEngine>(provider => getProviderToken(provider) === CarWithOptionalEngine);

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with reference optional nonexistent dependency', async () => {
      const injector = await Injector.create([CarWithOptionalEngine]);
      const car = await injector.find<CarWithOptionalEngine>(provider => getProviderToken(provider) === CarWithOptionalEngine);

      expect(car).toBeInstanceOf(CarWithOptionalEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with dependency by Inject annotation', async () => {
      const injector = await Injector.create([Engine, CarWithInjectEngine]);
      const car = await injector.find<CarWithInjectEngine>(provider => getProviderToken(provider) === CarWithInjectEngine);

      expect(car).toBeInstanceOf(CarWithInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation', () => {
      expect(Injector.create([CarWithInjectEngine]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngine) }`);
    });

    it('should correctly resolve class with dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([Engine, CarWithInjectEngineByForwardRef]);
      const car = await injector.find<CarWithInjectEngineByForwardRef>(provider => getProviderToken(provider) === CarWithInjectEngineByForwardRef);

      expect(car).toBeInstanceOf(CarWithInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should throw an exception if the class inject nonexistent dependency by Inject annotation and forwardRef', () => {
      expect(Injector.create([CarWithInjectEngineByForwardRef]))
        .rejects
        .toThrowError(`Artisan can't resolve dependency at index [0] in ${ getTokenName(CarWithInjectEngineByForwardRef) }`);
    });

    it('should correctly resolve class with optional dependency by Inject annotation', async () => {
      const injector = await Injector.create([Engine, CarWithOptionalInjectEngine]);
      const car = await injector.find<CarWithOptionalInjectEngine>(provider => getProviderToken(provider) === CarWithOptionalInjectEngine);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation', async () => {
      const injector = await Injector.create([CarWithOptionalInjectEngine]);
      const car = await injector.find<CarWithOptionalInjectEngine>(provider => getProviderToken(provider) === CarWithOptionalInjectEngine);

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngine);
      expect(car.engine).toBeUndefined();
    });

    it('should correctly resolve class with optional dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([Engine, CarWithOptionalInjectEngineByForwardRef]);
      const car = await injector.find<CarWithOptionalInjectEngineByForwardRef>(provider => {
        return getProviderToken(provider) === CarWithOptionalInjectEngineByForwardRef;
      });

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeInstanceOf(Engine);
    });

    it('should correctly resolve class with optional nonexistent dependency by Inject annotation and forwardRef', async () => {
      const injector = await Injector.create([CarWithOptionalInjectEngineByForwardRef]);
      const car = await injector.find<CarWithOptionalInjectEngineByForwardRef>(provider => {
        return getProviderToken(provider) === CarWithOptionalInjectEngineByForwardRef;
      });

      expect(car).toBeInstanceOf(CarWithOptionalInjectEngineByForwardRef);
      expect(car.engine).toBeUndefined();
    });
  });

  describe('using value providers', () => {
    it('should correctly resolve provider', async () => {
      const injector = await Injector.create([
        { provide: 'engine', useValue: 'v8' },
      ]);

      expect(await injector.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
    });
  });

  describe('using invalid providers', () => {
    it('should throw an exception if invalid provider passed', () => {
      const provider: any = {};

      expect(Injector.create([provider])).rejects.toThrowError(`Invalid provider '${ provider }'`);
    });
  });
});
