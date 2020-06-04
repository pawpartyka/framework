import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsString(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'string' || control.value instanceof String) {
      return null;
    }

    return options?.message || `The value must be a string`;
  };
}
