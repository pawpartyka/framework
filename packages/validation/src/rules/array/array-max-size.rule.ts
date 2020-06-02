import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMaxSize(max: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (Array.isArray(value) && value.length <= max) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain not more than ${ max } elements`;
  };
}
