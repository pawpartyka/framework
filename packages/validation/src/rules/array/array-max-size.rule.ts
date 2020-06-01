import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function arrayMaxSize(value: any, maximum: number): boolean {
  return Array.isArray(value) && value.length <= maximum;
}

export function ArrayMaxSize(maximum: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (arrayMaxSize(value, maximum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must contain not more than ${ maximum } elements`;
  };
}
