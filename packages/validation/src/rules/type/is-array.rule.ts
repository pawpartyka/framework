import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class IsArrayRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The "${ index }" must be an array`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return isArray(value);
  }
}

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function IsArray(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    name: 'isArray',
    rule: IsArrayRule,
  };
}
