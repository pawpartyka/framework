import { Injectable, Logger, LoggerFactory } from '@artisanjs/core';

@Injectable()
export class RabbitManager {
  protected readonly logger: Logger = LoggerFactory.getLogger(RabbitManager.name);
}
