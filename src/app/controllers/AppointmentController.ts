import { format, isBefore, parseISO, startOfHour, subHours } from 'date-fns';
import { Request, Response } from 'express';

import Queue from '../../lib/Queue';
import Appointment from '../entities/models/Appointment';
import User from '../entities/models/User';
import Notification from '../entities/schemas/Notification';
import AppointmentCancelMail from '../jobs/AppointmentCancelMail';
import { appointmentSchema, validateDate } from './validators/appointmentValidator';

class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!appointmentSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { provider, date } = req.body;

    if (provider === res.locals.id) {
      return res.status(400).json({ error: 'Provider cannot create an appointment for itself.' });
    }

    const isProvider = await User.getRepository()
      .createQueryBuilder()
      .where({ id: provider, provider: true })
      .getOne();

    if (!isProvider) {
      return res.status(400).json({ error: 'User is not provider.' });
    }

    const dateError = await validateDate(provider, date);

    if (dateError) {
      return res.status(400).json({ error: dateError });
    }

    const hourStart = startOfHour(parseISO(date));

    const appointment = await Appointment.create({
      user: res.locals.id,
      date: hourStart,
      provider: req.body.provider as any,
    }).save();

    const user = await User.getRepository()
      .createQueryBuilder('user')
      .select('user.name')
      .where({ id: res.locals.id })
      .getOne();

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const formattedDate = format(hourStart, 'MMMM do');
    const formattedTime = format(hourStart, 'h:mma');

    await Notification.create({
      content: `New appointment for ${user.name} on ${formattedDate} at ${formattedTime}`,
      user: req.body.provider,
    });

    return res.status(200).json(appointment);
  }

  async list(req: Request, res: Response): Promise<Response> {
    const resultsPerPage = 20;

    const skip = (parseInt(req.params.page, 10) * resultsPerPage) || 0;

    throw new Error('senty');

    const appointments = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .where({ provider: res.locals.id, canceledAt: null })
      .leftJoinAndSelect('appointment.provider', 'provider')
      .leftJoinAndSelect('provider.avatar', 'avatar')
      .leftJoin('appointment.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email'])
      .orderBy('appointment.date', 'DESC')
      .take(resultsPerPage)
      .skip(skip)
      .getMany();

    return res.status(200).json(appointments);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const appointment = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.provider', 'provider')
      .leftJoinAndSelect('provider.avatar', 'avatar')
      .loadRelationIdAndMap('appointment.user', 'appointment.user')
      .where({ id: req.params.id })
      .getOne();

    if (!appointment) {
      return res.status(400).json({ error: 'Appointment does not exists.' });
    }

    return res.status(200).json(appointment);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const appointment = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .leftJoin('appointment.provider', 'provider')
      .leftJoin('appointment.user', 'user')
      .addSelect(['provider.name', 'provider.email', 'user.name', 'user.id'])
      .where({ id: req.params.id })
      .getOne();

    if (!appointment) {
      return res.status(400).json({ error: 'Appointment does not exists.' });
    }

    if (appointment.user.id !== res.locals.id) {
      return res.status(401).json({ error: 'User does not have permission to cancel this appointment.' });
    }

    const maxHours = subHours(appointment.date, 2);

    if (isBefore(maxHours, new Date())) {
      return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance.' });
    }

    if (appointment.canceledAt) {
      return res.status(400).json({ error: 'Appointment already canceled.' });
    }

    appointment.canceledAt = new Date();

    await appointment.save();

    const hourStart = startOfHour(appointment.date);
    const formattedDate = format(hourStart, 'MMMM do');
    const formattedTime = format(hourStart, 'h:mma');

    await Queue.addJob(AppointmentCancelMail.key, {
      appointment,
      datetime: {
        date: formattedDate,
        time: formattedTime,
      },
    });

    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
