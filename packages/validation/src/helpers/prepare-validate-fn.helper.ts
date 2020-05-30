import { Injector } from '@artisanjs/core';
import { Rule } from '../interfaces/rule.interface';
import { Schema } from '../interfaces/schema.interface';
import { REQUIRED } from '../rules/required.rule';

export function prepareValidateFn(injector: Injector, schema: Schema, options: ValidateOptions): ValidationFn {
  return async (data: any) => {
    const errors: ValidationError[] = [];

    for (const [path, constraints] of Object.entries(schema)) {
      const isParentRequired: boolean = (schema[path.split('.').slice(0, -1).join('.')] || []).some(it => it.name === REQUIRED);
      const isPropertyRequired: boolean = constraints.some(it => it.name === REQUIRED);

      const paths: string[] = parse(path);

      for (const p of paths) {
        const parts: string[] = p.split('.');

        let parentValue: any = data;
        let propertyValue: any = data && data[parts[0]];

        for (let index = 1; index < parts.length; index++) {
          parentValue = propertyValue;
          propertyValue = propertyValue && propertyValue[parts[index]];
        }

        if ((!propertyValue && !isPropertyRequired) || (!parentValue && !isParentRequired)) {
          break;
        }

        const messages: string[] = [];

        for (const constraint of constraints) {
          const rule: Rule = await injector.find(constraint.rule);

          if (await rule.passes(constraint.args, propertyValue, null, data) === false) {
            messages.push(constraint.message || await rule.message(constraint.args, propertyValue, null, data));
          }
        }

        if (messages.length) {
          errors.push({ messages, path: p });
        }
      }
    }

    function parse(path: string): string[] {
      const paths: string[] = [];

      if (path.includes('*')) {
        let value: any = data;

        for (const part of path.split('.')) {
          if (part === '*') {
            for (const index of Object.keys(value || [])) {
              paths.push(...parse(path.replace('*', index)));
            }

            break;
          }

          value = value && value[part];
        }
      } else {
        paths.push(path);
      }

      return paths;
    }

    return { errors };
  };
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

export interface ValidationFn {
  (data: any): Promise<ValidationResult>;
}

export interface ValidationResult {
  errors: ValidationError[];
}
