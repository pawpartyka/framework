import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function ArrayMinSize(min: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (Array.isArray(value) && value.length >= min) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain at least ${ min } elements`;
  };
}
