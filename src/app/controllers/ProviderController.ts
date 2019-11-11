import { Request, Response } from 'express';

import User from '../entities/sql/User';

class ProviderController {
  async list(_req: Request, res: Response): Promise<Response> {
    const providers = await User.getRepository()
      .createQueryBuilder('user')
      .leftJoin('user.avatarId', 'avatar')
      .select([ 'user.id', 'user.name', 'user.email', 'avatar.name', 'avatar.path' ])
      .where({ provider: true })
      .getMany();

    return res.status(200).json(providers);
  }
}

export default new ProviderController();
