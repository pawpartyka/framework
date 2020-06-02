import { Rule, RuleOptions } from '../interfaces/rule.interface';

export function Required(options?: RuleOptions): Rule {
  const rule: Rule = (value: any, index: string, target: any) => {
    if (value !== undefined) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } is required`;
  };

  rule.implicit = true;

  return rule;
}
