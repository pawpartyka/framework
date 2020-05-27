import { ArtisanFactory } from '@artisanjs/core';
import 'reflect-metadata';
import { Required } from './rules/required.rule';
import { MinLength } from './rules/string/min-length.rule';
import { IsBoolean } from './rules/type/is-boolean.rule';
import { IsObject } from './rules/type/is-object.rule';
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

  /***********/

  /* EXAMPLE */

  validator
    .validate(
      {
        username: 12,
        password: 'maslo123',
        notAllowedValue: '123',
        address: {
          street: 'ulica 123',
        },
        shipping: {
          street: 123,
        },
        pseudonims: [
          { name: 'Mieszko', fine: true, nested: [{ secret: 'siema' }] },
          { name: 'Wieszko', fine: true },
          { name: 123, fine: false, nested: [{ secret: 'elo' }] },
          { name: 123, fine: false },
          'siema',
        ],
      },
      {
        'username': [Required(), MinLength(3)],
        'password': [Required()],

        'address': [Required()],
        'address.street': [Required(), MinLength(2)],

        'shipping': [], // shipping is optional
        'shipping.street': [Required()],

        'pseudonims': [Required()],
        'pseudonims.*': [IsObject()], // or - validate
        'pseudonims.*.name': [Required()],
        'pseudonims.*.fine': [IsBoolean()],
        'pseudonims.*.nested.*.secret': [MinLength(10)],
      },
    )
    .then(result => {
      console.log('object errors: ', JSON.stringify(result.errors, null, 4));
    });

  // validator
  //   .validate(
  //     [{ name: 'Paweł' }, { name: 'Ja' }, { name: 'Partyka' }],
  //     { '*.name': [MinLength(3)] },
  //   )
  //   .then(result => {
  //     console.log('object-array errors: ', result.errors);
  //   });

  // validator
  //   .validate(
  //     ['Paweł', 'Jan', 'Partyka'],
  //     { '*': [MinLength(3)] },
  //   )
  //   .then(result => {
  //     console.log('array errors: ', result.errors);
  //   });

  // validator
  //   .validate(
  //     {},
  //     [Required(), MinLength(6)],
  //   )
  //   .then(result => {
  //     console.log('string (primitive) errors: ', result.errors);
  //   });
})();
