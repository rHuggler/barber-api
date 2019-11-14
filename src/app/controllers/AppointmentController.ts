import { format, parseISO, startOfHour } from 'date-fns';
import { Request, Response } from 'express';

import Appointment from '../entities/models/Appointment';
import User from '../entities/models/User';
import Notification from '../entities/schemas/Notification';
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

    const hourStart = startOfHour(parseISO(date));

    const appointment = await Appointment.create({
      userId: res.locals.id,
      providerId: req.body.providerId,
      date: hourStart,
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
      user: req.body.providerId,
    });

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
