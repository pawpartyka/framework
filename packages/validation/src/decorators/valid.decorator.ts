import { Schema } from '../interfaces/schema.interface';
import { ValidateOptions } from '../services/validator.service';

export const VALID_METADATA = Symbol('artisanjs-validation:valid');

export function getValidMetadata(target: object): ValidMetadata | undefined {
  return Reflect.getMetadata(VALID_METADATA, target);
}

export function hasValidMetadata(target: object): boolean {
  return Reflect.hasMetadata(VALID_METADATA, target);
}

export function Valid(schema: Schema, options?: Pick<ValidOptions, 'schema'>): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const validMetadata: ValidMetadata = getValidMetadata(target) || {};

    validMetadata[parameterIndex] = [
      ...validMetadata[parameterIndex] || [],
      {
        ...options || {},
        schema: schema,
      },
    ];

    Reflect.defineMetadata(VALID_METADATA, validMetadata, target);
  };
}

export interface ValidMetadata {
  [name: string]: ValidOptions[];
}

export interface ValidOptions extends ValidateOptions {
  schema: Schema;
}
