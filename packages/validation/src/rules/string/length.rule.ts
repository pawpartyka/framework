import validator from 'validator';
import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Length(min: number, max: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' && validator.isLength(control.value, { min, max })) {
      return null;
    }

    return options?.message || `The value must be longer than or equal to ${ min } and shorter than or equal to ${ max } characters`;
  };
}