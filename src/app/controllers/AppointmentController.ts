import { Request, Response } from 'express';

import Appointment from '../entities/Appointment';
import User from '../entities/User';
import { appointmentSchema } from './validators/appointmentValidator';

class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!appointmentSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { providerId } = req.body;

    const isProvider = await User.getRepository()
      .createQueryBuilder()
      .where({ id: providerId, provider: true })
      .getOne();

    if (!isProvider) {
      return res.status(400).json({ error: 'Invalid provider.' });
    }

    const appointment = await Appointment.create({
      userId: res.locals.id,
      ...req.body,
    }).save();

    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
