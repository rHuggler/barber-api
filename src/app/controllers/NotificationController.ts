import { Request, Response } from 'express';

import User from '../entities/models/User';
import Notification from '../entities/schemas/Notification';

class NotificationController {
  async list(req: Request, res: Response): Promise<Response> {
    const isProvider = await User.getRepository()
      .createQueryBuilder()
      .where({ id: res.locals.id, provider: true })
      .getOne();

    if (!isProvider) {
      return res.status(400).json({ error: 'User is not provider.' });
    }

    const resultsPerPage = 20;

    const skip = (parseInt(req.params.page, 10) * resultsPerPage) || 0;

    const notifications = await Notification.find({
      user: res.locals.id,
    })
      .sort({ createdAt: 'DESC' })
      .limit(resultsPerPage)
      .skip(skip);

    return res.status(200).json(notifications);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    return res.status(200).json(notification);
  }
}

export default new NotificationController();
