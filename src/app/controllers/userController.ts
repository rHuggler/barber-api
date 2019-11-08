import { Request, Response } from 'express';

import User from '../entities/user';
import { userSchema, userUpdateSchema } from './validators/userValidator';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!userSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { email } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user = User.create(req.body);
    await user.save();

    const { id, name, provider } = user;
    return res.status(200).json({ id, name, email, provider});
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user = await User.findOne({ where: { id: req.params.id} });

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { id, name, email, provider } = user;
    return res.status(200).json({ id, name, email, provider});
  }

  async list(_req: Request, res: Response): Promise<Response> {
    const users = await User.find();

    return res.status(200).json(users);
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!userUpdateSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    if (req.params.id !== res.locals.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = await User.findOne({ where: { id: req.params.id} });

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { email, oldPassword } = req.body;

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(409).json({ error: 'Email already in use.' });
      }
    }

    if (!oldPassword) {
      return res.status(401).json({ error: 'Missing required parameter: oldPassword' });
    }

    if (!user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Invalid or incorrect password.' });
    }

    const updatedUser = User.merge(user, req.body);
    await updatedUser.save();

    return res.status(200).json(updatedUser);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (req.params.id !== res.locals.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = await User.findOne({ where: { id: res.locals.id} });

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    await user.remove();

    return res.status(204).send();
  }
}

export default new UserController();
