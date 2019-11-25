import Bull from 'bull';
import Mail from '../../lib/Mail';
import Appointment from '../entities/models/Appointment';
import IJob from './';

export interface IAppointmentCancelMail {
  appointment: Appointment;
  datetime: {
    date: string;
    time: string;
  };
}

class AppointmentCancelMail implements IJob {
  get key(): string {
    return 'AppointmentCancelMail';
  }

  async handle(job: Bull.Job) {
    const { appointment, datetime } = job.data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Canceled Appointment',
      text:
        `Your ${datetime.date} ${datetime.time} appointment with ${appointment.user.name} was canceled.`,
    });
  }
}

export default new AppointmentCancelMail();
