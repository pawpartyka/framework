import { Test } from '@artisanjs/testing';
import { ValidationPackage } from '../validation.package';
import { Validator } from './validator.service';

describe('Validator service', () => {
  let validator: Validator;

  beforeAll(async () => {
    const app = await Test
      .configureTestingApplication({
        packages: [
          ValidationPackage
            .configure()
            .register(),
        ],
      })
      .compile();

    validator = await app.find(Validator);
  });

  describe('validate', () => {
    describe('flatten', () => {
      it('test', async () => {
        const result = await validator.validate({}, { name: [] });

        expect(result.errors.length).toBe(0);
      });

      it('test2', async () => {
        const result = await validator.validate({}, { name: [] });

        expect(result.errors.length).toBe(0);
      });
    });

    // flat
    // nested flat
    // nested array
  });
});
