import {
  endOfDay,
  format,
  isAfter,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import { Between } from 'typeorm';

import Appointment from '../entities/models/Appointment';
import User from '../entities/models/User';

class ProviderController {
  async list(_req: Request, res: Response): Promise<Response> {
    const providers = await User.getRepository()
      .createQueryBuilder('user')
      .leftJoin('user.avatar', 'avatar')
      .select([ 'user.id', 'user.name', 'user.email', 'avatar.name', 'avatar.path' ])
      .where({ provider: true })
      .getMany();

    return res.status(200).json(providers);
  }

  async available(req: Request, res: Response): Promise<Response> {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const { id } = req.params;

    const parsedDate = parseISO(date);

    const appointments = await Appointment.getRepository()
      .createQueryBuilder('appointment')
      .where({
        provider: id,
        canceledAt: null,
        date: Between(startOfDay(parsedDate), endOfDay(parsedDate)),
      })
      .leftJoin('appointment.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .getMany();

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':').map((value) => parseInt(value, 10));
      const datetime = setSeconds( setMinutes( setHours(parsedDate, hour), minute), 0);

      const unavailable = appointments.find((appointment) => format(appointment.date, 'HH:mm') === time);
      const isAvailable = isAfter(datetime, new Date()) && !unavailable;

      return {
        time,
        datetime: format(datetime, "yyyy-MM-dd'T'HH:mm:ssXXX"), // tslint:disable-line:quotemark
        available: isAvailable,
      };
    });

    return res.status(200).json(available);
  }
}

export default new ProviderController();
