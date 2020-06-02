import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsObject(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a object`;
  };
}
