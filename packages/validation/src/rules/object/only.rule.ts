import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Only(properties: string[], options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    const keys: string[] = Object.keys(value);
    const notAllowed: string[] = [];

    for (const key of keys) {
      if (properties.includes(key) === false) {
        notAllowed.push(key);
      }
    }

    if (notAllowed.length === 0) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } contains not allowed properties: ${ notAllowed.join(', ') }`;
  };
}
