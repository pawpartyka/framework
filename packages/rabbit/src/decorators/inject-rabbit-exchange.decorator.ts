import { Inject } from '@artisanjs/core';
import { getExchangeToken } from '../providers/exchange.provider';

export function InjectRabbitExchange(name: string): ParameterDecorator {
  return Inject(getExchangeToken(name));
}
