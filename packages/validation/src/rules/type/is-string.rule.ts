import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsString(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'string' || value instanceof String) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a string`;
  };
}
