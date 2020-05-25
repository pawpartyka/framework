import { Inject } from '@artisanjs/core';
import { getConnectionToken } from '../providers/connection.provider';

export function InjectRabbitConnection(name: string): ParameterDecorator {
  return Inject(getConnectionToken(name));
}
