import { Test } from '@artisanjs/testing';
import { Validator } from '../../src/services/validator.service';
import { ValidationPackage } from '../../src/validation.package';

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

  it('test', () => {
    expect(1).toBe(1);
  });
});
