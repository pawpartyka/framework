import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Min(min: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'number' && control.value >= min) {
      return null;
    }

    return options?.message || `The value should have at least ${ min }`;
  };
}
