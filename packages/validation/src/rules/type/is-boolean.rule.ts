import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsBoolean(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'boolean' || control.value instanceof Boolean) {
      return null;
    }

    return options?.message || `The value must be a boolean`;
  };
}
