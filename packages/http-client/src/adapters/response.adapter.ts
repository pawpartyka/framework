import { HttpStatus } from '@artisanjs/common';
import * as Axios from 'axios';
import { Response } from '../interfaces/response.interface';

export function createResponseAdapter(axiosResponse: Axios.AxiosResponse): Response {
  return {
    data: axiosResponse.data,
    status: axiosResponse.status as HttpStatus,
    statusText: axiosResponse.statusText,
    headers: axiosResponse.headers,
    options: axiosResponse.config as any,
    request: axiosResponse.request,
  };
}
