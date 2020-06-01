import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function allow(value: any, allowed: string[]): boolean | string[] {
  const keys: string[] = Object.keys(value);
  const notAllowed: string[] = [];

  for (const key of keys) {
    if (allowed.includes(key) === false) {
      notAllowed.push(key);
    }
  }

  return notAllowed.length ? notAllowed : true;
}

export function Allow(allowed: string[], options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    const notAllowed: boolean | string[] = allow(value, allowed);

    if (!Array.isArray(notAllowed)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } contains not allowed properties: ${ notAllowed.join(', ') }`;
  };
}
