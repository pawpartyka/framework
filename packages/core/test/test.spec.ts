import { Test } from '../src/lib/test';
import { ApplicationBuilder } from '../src/lib/application-builder';
import { Injectable } from '../src/lib/decorators/injectable';
import { TestingLogger } from '../src/lib/testing-logger';
import { Provider } from '../src/lib/types/provider';
import { Inject } from '../src/lib/decorators/inject';
import { LoggerFactory } from '../src/lib/logger-factory';
import { getProviderToken } from '../src/lib/utils/get-provider-token';

describe('Test', () => {
  beforeEach(() => {
    jest.spyOn(LoggerFactory, 'useLogger').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should extends ApplicationBuilder', () => {
    expect(Test.configureTestingApplication({})).toBeInstanceOf(ApplicationBuilder);
  });

  it('should use TestingLogger', () => {
    const useLoggerSpy = jest.spyOn(ApplicationBuilder.prototype, 'useLogger').mockImplementation(jest.fn());

    Test.configureTestingApplication({});

    expect(useLoggerSpy).toHaveBeenNthCalledWith(1, TestingLogger);
  });

  describe('overrideProvider', () => {
    @Injectable()
    class Car {
      constructor(@Inject('engine') public engine: string) {
      }
    }

    const providers: Provider[] = [Car, { provide: 'engine', useValue: 'engine' }];

    describe('useClass', () => {
      it('should properly override providers', async () => {
        @Injectable()
        class TestingCar {
          constructor(@Inject('engine') public engine: string) {
          }
        }

        @Injectable()
        class TestingEngine {
        }

        {
          const application = await Test
            .configureTestingApplication({
              providers: providers,
            })
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
            })
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
              providers: providers,
            })
            .overrideProvider(Car).useClass(TestingCar)
            .overrideProvider('engine').useClass(TestingEngine)
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toBeInstanceOf(TestingCar);
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toBeInstanceOf(TestingEngine);
        }
      });
    });

    describe('useFactory', () => {
      it('should properly override providers', async () => {
        {
          const application = await Test
            .configureTestingApplication({
              providers: providers,
            })
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
            })
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
              providers: providers,
            })
            .overrideProvider(Car).useFactory({ dependencies: ['engine'], factory: engine => ({ engine }) })
            .overrideProvider('engine').useFactory({ factory: () => 'v8' })
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual({ engine: 'v8' });
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }
      });
    });

    describe('useValue', () => {
      it('should properly override providers', async () => {
        {
          const application = await Test
            .configureTestingApplication({
              providers: providers,
            })
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
            })
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }

        {
          const application = await Test
            .configureTestingApplication({
              packages: [
                { providers: providers },
              ],
              providers: providers,
            })
            .overrideProvider(Car).useValue('BMW')
            .overrideProvider('engine').useValue('v8')
            .compile();

          expect(await application.find(provider => getProviderToken(provider) === Car)).toEqual('BMW');
          expect(await application.find(provider => getProviderToken(provider) === 'engine')).toEqual('v8');
        }
      });
    });
  });
});
