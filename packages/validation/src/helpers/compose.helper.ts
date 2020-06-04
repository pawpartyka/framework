import { Control } from '../interfaces/control.interface';
import { Rule } from '../interfaces/rule.interface';

export function compose(rules: Rule[]): Rule {
  return async (control: Control) => {
    const messages: string[] = [];

    for (const rule of rules) {
      const result: null | string | string[] = await rule(control);

      if (result !== null) {
        messages.push(...Array.isArray(result) ? result : [result]);
      }
    }

    return messages.length ? messages : null;
  };
}
