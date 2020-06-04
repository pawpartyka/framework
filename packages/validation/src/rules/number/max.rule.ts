import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Max(max: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'number' && control.value >= max) {
      return null;
    }

    return options?.message || `The value should ${ max }`;
  };
}
