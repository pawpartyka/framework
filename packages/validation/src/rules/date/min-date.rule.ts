import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MinDate(min: Date, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || control.value instanceof Date && control.value.getTime() >= min.getTime()) {
      return null;
    }

    return options?.message || `The value must contain date greater than or equal to ${ min }`;
  };
}
