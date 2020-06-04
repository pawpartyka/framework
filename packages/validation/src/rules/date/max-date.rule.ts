import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function MaxDate(max: Date, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || control.value instanceof Date && control.value.getTime() <= max.getTime()) {
      return null;
    }

    return options?.message || `The value must contain date less than or equal to ${ max }`;
  };
}