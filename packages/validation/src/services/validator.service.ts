import { Injectable, Injector } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Constraint, Schema } from '../interfaces/schema.interface';

@Injectable()
export class Validator {
  constructor(private readonly injector: Injector) {
  }

  public async validate(target: any | any[], schema: Schema, options: ValidateOptions = DEFAULT_VALIDATE_OPTIONS): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    for (const [path, constraints] of Object.entries(schema)) {
      errors.push(...await this.validateConstraints(target, [], path, constraints));
    }

    return {
      errors: errors,
    };
  }

  private async validateConstraints(target: any | any[], path: string[], property: string, constraints: Constraint[]): Promise<ValidationError[]> {
    // console.log('----- path: ', path, target);

    const keys: string[] = property.split('.');
    const errors: ValidationError[] = [];

    if (property.includes('.')) {
      // nesting
      if (keys[0] === '*') {
        for (const [index, val] of Object.entries(target || [])) {
          errors.push(...await this.validateConstraints(val, [...path, index], keys.slice(1).join('.'), constraints));
        }
      } else {
        errors.push(...await this.validateConstraints(target && target[keys[0]], [...path, keys[0]], keys.slice(1).join('.'), constraints));
      }
    } else {
      // exec validation
      // required check
      if (keys[0] === '*') {
        for (const [index, val] of Object.entries(target || [])) {
          const messages: string[] = await this.validateValue(val, index, target, constraints);

          // if (messages.length) {
          errors.push({ messages, path: [...path, index].join('.') });
          // }
        }
      } else {
        const messages: string[] = await this.validateValue(target[property], property, target, constraints);

        // if (messages.length) {
        errors.push({ messages, path: [...path, property.split('.')[0]].join('.') });
        // }
      }
    }

    return errors;
  }

  private async validateValue(value: any, index: string, target: any, constraints: Constraint[]): Promise<string[]> {
    console.log('----- path: ', value, index, target);

    const messages: string[] = [];

    for (const constraint of constraints) {
      const rule: Rule = await this.injector.find(constraint.rule);

      if (await rule.passes(constraint.args, value, index, target) === false) {
        messages.push(await rule.message(constraint.args, value, index, target));
      }
    }

    return messages;
  }
}

export const DEFAULT_VALIDATE_OPTIONS: ValidateOptions = {
  allowUnknown: true,
};

export interface ValidateOptions {
  allowUnknown?: boolean;
}

export interface ValidationError {
  messages: string[];
  path: string;
}

export interface ValidationResult {
  errors: ValidationError[];
}
