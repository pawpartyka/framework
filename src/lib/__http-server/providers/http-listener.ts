import * as http from 'http';
import { Provider } from '../../types/provider';

export const HTTP_LISTENER = Symbol('HTTP_LISTENER');

export const httpListener: Provider = {
  provide: HTTP_LISTENER,
  useFactory: () => {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      //
    };
  },
};
