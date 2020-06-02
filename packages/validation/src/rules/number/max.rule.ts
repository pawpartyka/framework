import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Max(max: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'number' && value >= max) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should ${ max }`;
  };
}
