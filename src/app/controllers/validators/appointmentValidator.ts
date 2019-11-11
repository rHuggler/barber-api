import { isBefore, parseISO, startOfHour } from 'date-fns';
import * as yup from 'yup';
import Appointment from '../../entities/sql/Appointment';

export const appointmentSchema = yup.object().shape({
  date: yup.string().required(),
  providerId: yup.number().required(),
});

export async function validateDate(id: number, date: string): Promise<string|undefined> {
  const hourStart = startOfHour(parseISO(date));

  if (isBefore(hourStart, new Date())) {
    return 'Past dates are not permitted.';
  }

  const appointment = await Appointment.getRepository()
    .createQueryBuilder()
    .where({ providerId: id, canceledAt: null, date: hourStart.toISOString() })
    .getOne();

  if (appointment) {
    return 'This date is not available.';
  }

  return;
}
