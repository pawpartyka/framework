import { ArtisanFactory, Logger } from '@artisanjs/core';
import 'reflect-metadata';
import { ArrayMinSize } from './rules/array/array-min-size.rule';
import { Min } from './rules/number/min.rule';
import { Only } from './rules/object/only.rule';
import { Required } from './rules/required.rule';
import { Length } from './rules/string/length.rule';
import { MaxLength } from './rules/string/max-length.rule';
import { MinLength } from './rules/string/min-length.rule';
import { IsArray } from './rules/type/is-array.rule';
import { IsBoolean } from './rules/type/is-boolean.rule';
import { IsNumber } from './rules/type/is-number.rule';
import { IsObject } from './rules/type/is-object.rule';
import { IsString } from './rules/type/is-string.rule';
import { Validator } from './services/validator.service';
import { ValidationPackage } from './validation.package';
import { RequiredIf } from './rules/required-if.rule';
import { ValidateIf } from './rules/validate-if.rule';

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
        username: 'lore',
        // password: 'wow1',
        address: {
          test: 123,
        },
      },
      {
        '': [Required(), IsObject(), control => {
          console.log(':', control);
          return null;
        }],
        'username': [ValidateIf(control => control.parent.value.password === 'wow', [MinLength(10)]), control => {
          console.log('username:', control);
          return null;
        }],
        'password': [RequiredIf(control => control.parent.value.username), MinLength(5)],

        'address': [Required(), control => {
          console.log('address:', control);
          return null;
        }],
        'address.street': [Required(), MinLength(2), control => {
          console.log('address.street:', control);
          return null;
        }],
        // 'address.test': [Required(), IsObject()],
        // 'address.test.lorem': [Required(), IsNumber()],
        // 'address.test.ipsum': [Required(), IsString()],
        // 'address.test.foo': [IsObject()],
        // 'address.test.foo.213123123dasdasd1212dda': [Required(), IsString()],

        // 'shipping': [], // shipping is optional
        // 'shipping.street': [MinLength(7), MaxLength(50)],

        // 'asd': [IsArray()],
        // 'asd.*': [IsObject()],
        //
        // 'pseudonims': [Required()],
        // 'pseudonims.*': [IsObject()], // or - validate
        // 'pseudonims.*.name': [Required()],
        // 'pseudonims.*.fine': [IsBoolean()],
        // 'pseudonims.*.nested.*.secret': [MinLength(10)],
      },
    ),
    null,
    4,
  ));

  // console.log('object-array errors: ', JSON.stringify(
  //   await validator.validate(
  //     null,
  //     {
  //       '': [Required(), IsString(), ArrayMinSize(5)],
  //       // '*': [IsObject(), Only(['name', 'fine'])],
  //       '*.name': [Required(), IsString()],
  //       '*.fine': [Required(), IsBoolean(), IsString()],
  //     },
  //   ),
  //   null,
  //   4,
  // ));

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
