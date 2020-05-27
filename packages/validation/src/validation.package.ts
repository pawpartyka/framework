import { Package, Provider, Type } from '@artisanjs/core';
import { Rule } from './interfaces/rule.interface';
import { MaxRule } from './rules/number/max.rule';
import { MinRule } from './rules/number/min.rule';
import { RequiredRule } from './rules/required.rule';
import { MaxLengthRule } from './rules/string/max-length.rule';
import { MinLengthRule } from './rules/string/min-length.rule';
import { IsArrayRule } from './rules/type/is-array.rule';
import { IsBooleanRule } from './rules/type/is-boolean.rule';
import { IsNumberRule } from './rules/type/is-number.rule';
import { IsObjectRule } from './rules/type/is-object.rule';
import { IsStringRule } from './rules/type/is-string.rule';
import { Validator } from './services/validator.service';

const BUILT_IN_RULES: Type<Rule>[] = [
  /* Number */
  MaxRule,
  MinRule,

  /* String */
  MaxLengthRule,
  MinLengthRule,

  /* Type */
  IsArrayRule,
  IsBooleanRule,
  IsNumberRule,
  IsObjectRule,
  IsStringRule,

  /* Common */
  RequiredRule,
];

export class ValidationPackage {
  public static configure(): ValidationPackage {
    return new ValidationPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      ...BUILT_IN_RULES,

      Validator,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
