import { Injectable } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Constraint } from '../interfaces/schema.interface';

@Injectable()
export class ValidateRule implements Rule {
  public message(args: any[], value: any, index: string, target: any): string {
    return `The ${ index || 'value' } is invalid`;
  }

  public passes(args: any[], value: any, index: string, target: any): boolean {
    return args[0](args, value, index, target);
  }
}

export const VALIDATE: symbol = Symbol('validate');

export function Validate(
  passes: (args: any[], value: any, index: string, target: any) => boolean | Promise<boolean>,
  options?: Pick<Constraint, 'message'>,
): Constraint {
  return {
    args: [passes],
    message: options?.message,
    name: VALIDATE,
    rule: ValidateRule,
  };
}
