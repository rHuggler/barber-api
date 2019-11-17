import nodemailer, { Transporter } from 'nodemailer';
import { defaultSender, transportOptions } from '../config/mailer';

class Mail {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(transportOptions);
  }

  sendMail(message: object) {
    return this.transporter.sendMail({
      ...defaultSender,
      ...message,
    });
  }
}

export default new Mail();
