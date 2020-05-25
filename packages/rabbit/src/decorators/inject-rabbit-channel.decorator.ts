import { Inject } from '@artisanjs/core';
import { getChannelToken } from '../providers/channel.provider';

export function InjectRabbitChannel(name: string): ParameterDecorator {
  return Inject(getChannelToken(name));
}
