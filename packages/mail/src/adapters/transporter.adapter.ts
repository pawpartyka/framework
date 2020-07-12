import * as nodemailer from 'nodemailer';
import { SendMailOptions, Transporter } from '../interfaces/transporter.interface';

export function createTransporterAdapter(nativeTransporter: nodemailer.Transporter): Transporter {
  return {
    sendMail: async (options: SendMailOptions): Promise<any> => {
      return await nativeTransporter.sendMail(options);
    },
  };
}
