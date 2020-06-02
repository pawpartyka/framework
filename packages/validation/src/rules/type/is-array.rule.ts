import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsArray(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (Array.isArray(value)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be an array`;
  };
}
