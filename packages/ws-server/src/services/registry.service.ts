import { Injectable } from '@artisanjs/core';
import ws from 'ws';

@Injectable()
export class Registry extends Map<string, ws.Server> {
}
