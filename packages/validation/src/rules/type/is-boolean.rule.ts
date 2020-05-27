import { Injectable } from '@artisanjs/core';
import { Rule } from '../../interfaces/rule.interface';
import { Constraint } from '../../interfaces/schema.interface';

@Injectable()
export class IsBooleanRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The "${ index }" must be a boolean`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return isBoolean(value);
  }
}

export function isBoolean(value: any): boolean {
  console.log('ibv: ', value);
  return typeof value === 'boolean' || value instanceof Boolean;
}

export function IsBoolean(options?: Pick<Constraint, 'message'>): Constraint {
  return {
    args: [],
    message: options?.message,
    rule: IsBooleanRule,
  };
}
