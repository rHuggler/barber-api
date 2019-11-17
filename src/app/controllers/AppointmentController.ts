import { format, isBefore, parseISO, startOfHour, subHours } from 'date-fns';
import { Request, Response } from 'express';

// import Mail from '../../lib/Mail';
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

    if (providerId === res.locals.id) {
      return res.status(400).json({ error: 'Provider cannot create an appointment for itself.' });
    }

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
      .loadRelationIdAndMap('appointment.userId', 'appointment.userId')
      .take(resultsPerPage)
      .skip(skip)
      .getMany();

    return res.status(200).json(appointments);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const appointment = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.providerId', 'provider')
      .leftJoinAndSelect('provider.avatarId', 'avatar')
      .loadRelationIdAndMap('appointment.userId', 'appointment.userId')
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
      .leftJoin('appointment.providerId', 'provider')
      .addSelect(['provider.name', 'provider.email'])
      .loadRelationIdAndMap('appointment.userId', 'appointment.userId')
      .where({ id: req.params.id })
      .getOne();

    if (!appointment) {
      return res.status(400).json({ error: 'Appointment does not exists.' });
    }

    if (appointment.userId !== res.locals.id) {
      return res.status(401).json({ error: 'User does not have permission to cancel this appointment.' });
    }

    const maxHours = subHours(appointment.date, 2);

    if (isBefore(maxHours, new Date())) {
      return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance.' });
    }

    appointment.canceledAt = new Date();

    await appointment.save();

    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
