import { Rule, RuleOptions } from '../../interfaces/rule.interface';

export function max(value: any, maximum: number): boolean {
  return typeof value === 'number' && value >= maximum;
}

export function Max(maximum: number, options?: RuleOptions): Rule {
  return (value: any, index: string, target: any) => {
    if (max(value, maximum)) {
      return null;
    }

    return options?.message || `The ${ index || 'value' } should ${ maximum }`;
  };
}
