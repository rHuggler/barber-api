import { parseISO, startOfHour } from 'date-fns';
import { Request, Response } from 'express';

import Notification from '../entities/no-sql/Notification';
import Appointment from '../entities/sql/Appointment';
import User from '../entities/sql/User';
import { appointmentSchema, validateDate } from './validators/appointmentValidator';

class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!appointmentSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { providerId, date } = req.body;

    const isProvider = await User.getRepository()
      .createQueryBuilder()
      .where({ id: providerId, provider: true })
      .getOne();

    if (!isProvider) {
      return res.status(400).json({ error: 'User is not provider.' });
    }

    const dateError = await validateDate(providerId, date);

    if (dateError) {
      return res.status(400).json({ error: dateError });
    }

    const hourStart = startOfHour(parseISO(date)).toISOString();

    const appointment = await Appointment.create({
      userId: res.locals.id,
      providerId: req.body.providerId,
      date: hourStart,
    }).save();

    await Notification.create({
      content: 'New appointment for you.',
      userId: req.body.providerId,
    }).save();

    return res.status(200).json(appointment);
  }

  async list(req: Request, res: Response): Promise<Response> {
    const resultsPerPage = 20;

    const skip = (parseInt(req.params.page, 10) * resultsPerPage) || 0;

    const appointments = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .where({ providerId: res.locals.id, canceledAt: null })
      .leftJoinAndSelect('appointment.providerId', 'provider')
      .leftJoinAndSelect('provider.avatarId', 'avatar')
      .take(resultsPerPage)
      .skip(skip)
      .getMany();

    return res.status(200).json(appointments);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const appointments = await Appointment.getRepository()
      .createQueryBuilder()
      .where({ id: req.params.id })
      .loadAllRelationIds()
      .getOne();

    return res.status(200).json(appointments);
  }
}

export default new AppointmentController();
