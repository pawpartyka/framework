import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function required(value: any): boolean {
  return value !== undefined;
}

export function Required(options?: RuleOptions): Rule {
  const rule: Rule = (value: any, index: string, target: any) => {
    if (required(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } is required`;
  };

  rule.implicit = true;

  return rule;
}
