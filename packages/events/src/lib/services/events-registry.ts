import { Injectable } from '@artisanjs/core';

@Injectable()
export class EventsRegistry extends Array<{ event: string, handler: (data: any) => void }> {
}
