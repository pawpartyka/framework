import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsDate(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || control.value instanceof Date) {
      return null;
    }

    return options?.message || `The value must be a date instance`;
  };
}
