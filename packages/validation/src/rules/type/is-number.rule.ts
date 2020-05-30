import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class IsNumberRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The ${ index || 'value' } must be a number`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return isNumber(value);
  }
}

export const IS_NUMBER: symbol = Symbol('is-number');

export function isNumber(value: any): boolean {
  return typeof value === 'number' || value instanceof Number;
}

export function IsNumber(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    name: IS_NUMBER,
    rule: IsNumberRule,
  };
}
