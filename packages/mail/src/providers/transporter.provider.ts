import { Provider, Token } from '@artisanjs/core';
import * as nodemailer from 'nodemailer';
import { createTransporterAdapter } from '../adapters/transporter.adapter';
import { TransporterOptions } from '../interfaces/transporter-options.interface';
import { Transporter } from '../interfaces/transporter.interface';
import { getTransporterOptionsToken } from './transporter-options.provider';

export function createTransporterProvider(storageName: string): Provider {
  return {
    provide: getTransporterToken(storageName),
    useFactory: (transporterOptions: TransporterOptions): Transporter => {
      return createTransporterAdapter(nodemailer.createTransport(transporterOptions));
    },
    inject: [getTransporterOptionsToken(storageName)],
  };
}

export function getTransporterToken(name: string): Token {
  return `Transporter_${ name }`;
}
