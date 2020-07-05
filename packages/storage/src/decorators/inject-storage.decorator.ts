import { Inject } from '@artisanjs/core';
import { getStorageToken } from '../providers/storage.provider';

export function InjectStorage(name: string): ParameterDecorator {
  return Inject(getStorageToken(name));
}
