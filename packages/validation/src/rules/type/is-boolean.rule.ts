import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function IsBoolean(options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (typeof value === 'boolean' || value instanceof Boolean) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } must be a boolean`;
  };
}
