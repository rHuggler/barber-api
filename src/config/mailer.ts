import { Options } from 'nodemailer/lib/smtp-transport';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
const EMAIL_USER = process.env.EMAIL_USER || 'b188bb9fa8c4ec';
const EMAIL_PASS = process.env.EMAIL_PASS || '39bf12c54e1451';

export const transportOptions: Options = {
  host: EMAIL_HOST,
  port: 2525,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
};

export const defaultSender = {
    from: 'GoBarber <noreply@gobarber.com>',
};
