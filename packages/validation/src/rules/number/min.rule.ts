import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function Min(min: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'number' && value >= min) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should have at least ${ min }`;
  };
}
