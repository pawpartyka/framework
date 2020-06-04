import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsObject(options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'object' && control.value !== null && !Array.isArray(control.value)) {
      return null;
    }

    return options?.message || `The value must be a object`;
  };
}
