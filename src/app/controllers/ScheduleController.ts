import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import { Between } from 'typeorm';

import Appointment from '../entities/sql/Appointment';
import User from '../entities/sql/User';

class ScheduleController {
  async list(req: Request, res: Response): Promise<Response> {
    const provider = await User.getRepository()
      .createQueryBuilder()
      .where({ id: res.locals.id, provider: true })
      .getOne();

    if (!provider) {
      return res.status(400).json({ error: 'User is not provider.' });
    }

    const date = parseISO(req.query.date);

    const appointments = await Appointment.getRepository()
      .createQueryBuilder()
      .where({
        providerId: res.locals.id,
        canceledAt: null,
        date: Between(startOfDay(date), endOfDay(date)),
      })
      .getMany();

    return res.status(200).json(appointments);
  }
}

export default new ScheduleController();
