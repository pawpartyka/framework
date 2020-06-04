import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Min(min: number, options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined || typeof control.value === 'number' && control.value >= min) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } should have at least ${ min }`;
  };
}
