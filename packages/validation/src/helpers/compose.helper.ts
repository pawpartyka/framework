import { Rule } from '../interfaces/rule.interface';

export function compose(rules: Rule[]): Rule {
  return async (value: any, index: string, target: any) => {
    const messages: string[] = [];

    for (const rule of rules) {
      const result: null | string | string[] = await rule(value, index, target);

      if (result !== null) {
        messages.push(...Array.isArray(result) ? result : [result]);
      }
    }

    return messages.length ? messages : null;
  };
}
