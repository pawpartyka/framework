import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class IsObjectRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The "${ index }" must be a object`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return isObject(value);
  }
}

export function isObject(value: any): boolean {
  return typeof value === 'object' || value instanceof Object;
}

export function IsObject(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    rule: IsObjectRule,
  };
}
