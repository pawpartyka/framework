import { ArtisanFactory, Logger } from '@artisanjs/core';
import 'reflect-metadata';
import { ArrayMinSize } from './rules/array/array-min-size.rule';
import { Min } from './rules/number/min.rule';
import { Allow } from './rules/object/allow.rule';
import { Required } from './rules/required.rule';
import { Length } from './rules/string/length.rule';
import { MaxLength } from './rules/string/max-length.rule';
import { MinLength } from './rules/string/min-length.rule';
import { isArray, IsArray } from './rules/type/is-array.rule';
import { IsBoolean } from './rules/type/is-boolean.rule';
import { IsNumber } from './rules/type/is-number.rule';
import { IsObject } from './rules/type/is-object.rule';
import { IsString } from './rules/type/is-string.rule';
import { Validator } from './services/validator.service';
import { ValidationPackage } from './validation.package';
import { Conditional } from './rules/conditional.rule';
import { compose } from './helpers/compose.helper';

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
  // console.log('object errors: ', JSON.stringify(
  //   await validator.validate(
  //     undefined,
  //     {
  //       '': [Required(), IsObject()],
  //       'username': [Required(), MinLength(3), value => `Wyjebalo blad ${ value }`],
  //       'password': [Required(), MinLength(5)],
  //
  //       'address': [Required()],
  //       'address.street': [Required(), MinLength(2)],
  //       'address.test': [Required(), IsObject()],
  //       'address.test.lorem': [Required(), IsNumber()],
  //       'address.test.ipsum': [Required(), IsString()],
  //       'address.test.foo': [IsObject()],
  //       'address.test.foo.213123123dasdasd1212dda': [Required(), IsString()],
  //
  //       'shipping': [], // shipping is optional
  //       'shipping.street': [MinLength(7), MaxLength(50)],
  //
  //       'asd': [IsArray()],
  //       'asd.*': [IsObject()],
  //
  //       'pseudonims': [Required()],
  //       'pseudonims.*': [IsObject()], // or - validate
  //       'pseudonims.*.name': [Required()],
  //       'pseudonims.*.fine': [IsBoolean()],
  //       'pseudonims.*.nested.*.secret': [MinLength(10)],
  //     },
  //     {
  //       allowUnknown: false,
  //     },
  //   ),
  //   null,
  //   4,
  // ));

  console.log('object-array errors: ', JSON.stringify(
    await validator.validate(
      [{ name: 'Pabl' }, { name: 'Pa' }, { name: 'Test' }, { name: 'wow', fine: true, lorem: 123 }],
      {
        '': [Required(), IsArray(), ArrayMinSize(4)],
        '*': [IsObject(), Allow(['name'])],
        '*.name': [
          Conditional(value => value === 'wow', [MinLength(5)], [MinLength(10)]),
          (value, index, target) => {
            if (true) {
              return compose([IsNumber(), IsBoolean()])(value, index, target);
            }
          },
        ],
      },
    ),
    null,
    4,
  ));

  // console.log('array errors: ', JSON.stringify(
  //   await validator.validate(
  //     ['Paweł', 'Jan', 'Partyka', 'Elo'],
  //     {
  //       '*': [MinLength(5)],
  //     },
  //   ),
  //   null,
  //   4,
  // ));
  //
  // console.log('string (primitive) errors: ', JSON.stringify(
  //   await validator.validate(
  //     6,
  //     {
  //       '': [Required(), Min(6), IsNumber()],
  //     },
  //   ),
  //   null,
  //   4,
  // ));
  logger.info('end validation');
})();
