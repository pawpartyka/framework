import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MinDate(min: Date, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || control.value instanceof Date && control.value.getTime() >= min.getTime()) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } must contain date greater than or equal to ${ min }`;
  };
}
