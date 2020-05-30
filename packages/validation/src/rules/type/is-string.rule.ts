import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class IsStringRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The ${ index || 'value' } must be a string`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return isString(value);
  }
}

export const IS_STRING: symbol = Symbol('is-string');

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function IsString(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    name: IS_STRING,
    rule: IsStringRule,
  };
}
