import { Inject } from '@artisanjs/core';
import { getTransporterToken } from '../providers/transporter.provider';

export function InjectTransporter(name: string): ParameterDecorator {
  return Inject(getTransporterToken(name));
}
