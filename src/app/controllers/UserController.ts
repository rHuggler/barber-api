import { Request, Response } from 'express';
import { FindOneOptions } from 'typeorm';

import User from '../entities/User';
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

    const { id, name, provider, avatarId } = user;
    return res.status(200).json({ id, name, email, provider, avatarId });
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user = await User.findOne({ where: { id: req.params.id }, loadRelationIds: true });

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { id, name, email, provider, avatarId } = user;
    return res.status(200).json({ id, name, email, provider, avatarId });
  }

  async list(_req: Request, res: Response): Promise<Response> {
    const users = await User.find({ loadRelationIds: true });

    return res.status(200).json(users);
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!userUpdateSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    if (req.params.id !== res.locals.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const select = ['id', 'email', 'name', 'avatarId', 'provider'];

    if (req.body.oldPassword) {
      select.push('password');
    }

    const findOptions: FindOneOptions = {
      where: { id: req.params.id },
      loadRelationIds: true,
      select,
    };

    const user = await User.findOne(findOptions);

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

    if (oldPassword && !user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Invalid or incorrect password.' });
    }

    const updatedUser = User.merge(user, req.body);
    await updatedUser.save();

    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      provider: updatedUser.provider,
      avatarId: updatedUser.avatarId,
      updatedAt: updatedUser.updatedAt,
    });
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

  async regenPassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'password', 'provider', 'avatarId'],
    });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const password = user.regeneratePassword();
    await user.save();

    return res.status(200).json({ password });
  }
}

export default new UserController();
