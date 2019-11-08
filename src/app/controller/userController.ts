import { Request, Response } from 'express';

import User from '../entity/user';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user: User = User.create(req.body);
    await user.save();

    const { id, name, provider } = user;
    return res.status(200).json({ id, name, email, provider});
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user: User | undefined = await User.findOne(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { id, name, email, provider } = user;
    return res.status(200).json({ id, name, email, provider});
  }

  async list(_req: Request, res: Response): Promise<Response> {
    const users: User[] = await User.find();

    return res.status(200).json(users);
  }

  async update(_req: Request, res: Response): Promise<Response> {

    return res.status(403).send();

    // if (!user) {
    //   return res.status(400).json({ error: 'User does not exists.' });
    // }

    // await user.save();

    // return res.status(200).json(user);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const user: User | undefined = await User.findOne(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    await user.remove();

    return res.status(204).send();
  }
}

export default new UserController();
