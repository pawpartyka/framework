import { Type } from './type.interface';

export type Token<T = any> = string | symbol | Type<T>;
