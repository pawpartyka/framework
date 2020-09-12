import { Injectable } from '@artisanjs/core';

@Injectable()
export class Registry extends Array<{ event: string, handler: (...args: any[]) => any }> {
}
