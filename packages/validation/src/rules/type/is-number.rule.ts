import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsNumber(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'number' || control.value instanceof Number) {
      return null;
    }

    return options?.message || `The value must be a number`;
  };
}
