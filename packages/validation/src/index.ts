import { ArtisanFactory, Logger } from '@artisanjs/core';
import 'reflect-metadata';
import { Required } from './rules/required.rule';
import { MaxLength } from './rules/string/max-length.rule';
import { MinLength } from './rules/string/min-length.rule';
import { IsBoolean } from './rules/type/is-boolean.rule';
import { IsNumber } from './rules/type/is-number.rule';
import { IsObject } from './rules/type/is-object.rule';
import { IsString } from './rules/type/is-string.rule';
import { Validator } from './services/validator.service';
import { ValidationPackage } from './validation.package';

export * from './validation.package';

(async (): Promise<void> => {
  const app = await ArtisanFactory
    .configureApplication({
      packages: [ValidationPackage.configure().register()],
    })
    .compile();

  const validator: Validator = await app.find(Validator);
  const logger: Logger = await app.find(Logger);

  /***********/

  /* EXAMPLE */
  logger.info('start validation');
  console.log('object errors: ', JSON.stringify(
    await validator.validate(
      {
        username: '12321312',
        password: 'mas11',
        notAllowedValue: '123',
        address: {
          street: 'ulica 123',
          // test: { // required
            // lorem: 123,
          // },
        },
        shipping: {
          street: 'asdasdasd',
        },
        pseudonims: [
          { name: 'Mieszko', fine: true, nested: [{ secret: 'siema123123123' }, { secret: 'asdasdas' }] },
          { name: 'Wieszko', fine: true },
          { name: 123, fine: false, nested: [{ secret: 'elo1231232132131212' }] },
          { name: 123, fine: false, nested: [] },
          'siema',
        ],
      },
      {
        'username': [Required(), MinLength(3)],
        'password': [Required(), MinLength(5)],

        'address': [Required()],
        'address.street': [Required(), MinLength(2)],
        'address.test': [Required(), IsObject()],
        'address.test.lorem': [Required(), IsNumber()],
        'address.test.ipsum': [IsString()],

        'shipping': [], // shipping is optional
        'shipping.street': [MinLength(7), MaxLength(50)],

        'pseudonims': [Required()],
        'pseudonims.*': [IsObject()], // or - validate
        'pseudonims.*.name': [Required()],
        'pseudonims.*.fine': [IsBoolean()],
        'pseudonims.*.nested.*.secret': [MinLength(10)],
      },
    ),
    null,
    4,
  ));

  // console.log('object-array errors: ', JSON.stringify(
  //   await validator.validate(
  //     [{ name: 'Paweł' }, { name: 'Ja' }, { name: 'Partyka' }],
  //     { '*.name': [Required(), MinLength(3)] },
  //   ),
  //   null,
  //   4,
  // ));
  //
  // console.log('array errors: ', JSON.stringify(
  //   await validator.validate(
  //     ['Paweł', 'Jan', 'Partyka', 'Elo'],
  //     { '*': [MinLength(5)] },
  //   ),
  //   null,
  //   4,
  // ));

  // console.log('string (primitive) errors: ', JSON.stringify(
  //   validator.validate(
  //     'siema',
  //     [Required(), MinLength(6)],
  //   ),
  //   null,
  //   4,
  // ));
  logger.info('end validation');
})();
