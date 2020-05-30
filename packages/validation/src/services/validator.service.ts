import { Injectable, Injector } from '@artisanjs/core';
import {
  prepareValidateFn,
  DEFAULT_VALIDATE_OPTIONS,
  ValidateOptions,
  ValidationFn,
  ValidationResult,
} from '../helpers/prepare-validate-fn.helper';
import { Schema } from '../interfaces/schema.interface';

@Injectable()
export class Validator {
  constructor(private readonly injector: Injector) {
  }

  public async validate(data: any | any[], schema: Schema, options: ValidateOptions = DEFAULT_VALIDATE_OPTIONS): Promise<ValidationResult> {
    const validationFn: ValidationFn = prepareValidateFn(this.injector, schema, options);

    return await validationFn(data);

    // const errors: ValidationError[] = [];
    //
    // for (const [path, constraints] of Object.entries(schema)) {
    //   const isParentRequired: boolean = (schema[path.split('.').slice(0, -1).join('.')] || []).some(it => it.name === REQUIRED);
    //   const isPropertyRequired: boolean = constraints.some(it => it.name === REQUIRED);
    //
    //   errors.push(
    //     ...await this.validateConstraints(data, path, constraints, isRequiredParent),
    //   );
    // }
    //
    // return { errors };
  }

  // private async validateConstraints(target: any | any[], path: string, constraints: Constraint[], isRequiredParent: boolean): Promise<ValidationError[]> {
  //   const errors: ValidationError[] = [];
  //   const keys: string[] = path.split('.');
  //
  //   if (path.includes('.')) {
  //     // nesting
  //
  //     if (keys[0] === '*') {
  //       for (const [index, value] of Object.entries(target || [])) {
  //         for (const result of await this.validateConstraints(value, keys.slice(1).join('.'), constraints, isRequiredParent)) {
  //           errors.push({ messages: result.messages, path: `${ index }${ result.path ? `.${ result.path }` : '' }` });
  //         }
  //       }
  //     } else {
  //       for (const result of await this.validateConstraints(target && target[keys[0]], keys.slice(1).join('.'), constraints, isRequiredParent)) {
  //         errors.push({ messages: result.messages, path: `${ keys[0] }.${ result.path }` });
  //       }
  //     }
  //   } else {
  //     // exec validation
  //     const isRequired: boolean = constraints.some(it => it.name === REQUIRED);
  //
  //     if (keys[0] === '*') {
  //       if (target || (isRequired && isRequiredParent)) {
  //         for (const [index, value] of Object.entries(target || [])) {
  //           const messages: string[] = await this.validateValue(target, null, value, constraints);
  //
  //           if (messages.length) {
  //             errors.push({ messages, path: `${ index }` });
  //           }
  //         }
  //       }
  //     } else {
  //       if ((target && target[keys[0]]) || (isRequired && isRequiredParent)) {
  //         const messages: string[] = await this.validateValue(target, keys[0], target && target[keys[0]], constraints);
  //
  //         if (messages.length) {
  //           errors.push({ messages: messages, path: path });
  //         }
  //       }
  //     }
  //   }
  //
  //   return errors;
  // }
  //
  // private async validateValue(target: any, index: string, value: any, constraints: Constraint[]): Promise<string[]> {
  //   const messages: string[] = [];
  //
  //   for (const constraint of constraints) {
  //     const rule: Rule = await this.injector.find(constraint.rule);
  //
  //     if (await rule.passes(constraint.args, value, index, target) === false) {
  //       messages.push(constraint.message || await rule.message(constraint.args, value, index, target));
  //     }
  //   }
  //
  //   return messages;
  // }

  // private async validateConstraints(
  //  target: any | any[], path: string[], property: string, constraints: Constraint[], schema: Schema,
  // ): Promise<ValidationError[]> {
  //   // console.log('----- path: ', path, target);
  //
  //   const keys: string[] = property.split('.');
  //   const errors: ValidationError[] = [];
  //
  //   if (property.includes('.')) {
  //     // nesting
  //     if (keys[0] === '*') {
  //       for (const [index, val] of Object.entries(target || [])) {
  //         errors.push(...await this.validateConstraints(val, [...path, index], keys.slice(1).join('.'), constraints, schema));
  //       }
  //     } else {
  //       errors.push(...await this.validateConstraints(target && target[keys[0]], [...path, keys[0]], keys.slice(1).join('.'), constraints, schema));
  //     }
  //   } else {
  //     // exec validation
  //     // validate if
  //     // const validateIf: Constraint[] = constraints.filter(it => it.name === VALIDATE_IF);
  //     const isRequired: boolean = constraints.some(it => it.name === REQUIRED);
  //     const isRequiredParent: boolean = (schema[path.join('.')] || []).some(it => it.name === REQUIRED);
  //
  //     if (keys[0] === '*') {
  //       if (target || (isRequired && isRequiredParent)) {
  //         for (const [index, val] of Object.entries(target || [])) {
  //           const messages: string[] = await this.validateValue(val, null, target, constraints);
  //
  //           if (messages.length) {
  //             errors.push({ messages, path: [...path, index].join('.') });
  //           }
  //         }
  //       }
  //     } else {
  //       if ((target && target[property]) || (isRequired && isRequiredParent)) {
  //         const messages: string[] = await this.validateValue(target && target[property], property, target, constraints);
  //
  //         if (messages.length) {
  //           errors.push({ messages, path: [...path, property.split('.')[0]].join('.') });
  //         }
  //       }
  //     }
  //
  //   }
  //
  //   return errors;
  // }
}
