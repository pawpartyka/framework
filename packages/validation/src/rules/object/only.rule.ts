import { Control } from '../../interfaces/control.interface';
import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Only(properties: string[], options?: RuleOptions): Rule {
  return (control: Control) => {
    if (control.value === undefined) {
      return null;
    }

    const foreign: string[] = [];

    for (const key of Object.keys(control.value)) {
      if (properties.includes(key) === false) {
        foreign.push(key);
      }
    }

    if (foreign.length === 0) {
      return null;
    }

    if (options?.message) {
      return typeof options.message === 'string' ? options.message : options?.message(control);
    }

    return `The ${ control.property || 'value' } contains not allowed properties: ${ foreign.join(', ') }`;
  };
}
