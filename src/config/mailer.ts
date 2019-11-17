import { Options } from 'nodemailer/lib/smtp-transport';

export const transportOptions: Options = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'b188bb9fa8c4ec',
    pass: '39bf12c54e1451',
  },
};

export const defaultSender = {
    from: 'GoBarber <noreply@gobarber.com>',
};
