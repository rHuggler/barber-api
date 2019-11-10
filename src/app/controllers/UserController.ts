import { Request, Response } from 'express';

import User from '../entities/User';
import { userSchema, userUpdateSchema } from './validators/userValidator';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    if (!userSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { email } = req.body;

    const userExists = await User.getRepository()
      .createQueryBuilder()
      .where({ email })
      .getOne();

    if (userExists) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user = User.create(req.body);
    await user.save();

    const { id, name, provider, avatarId } = user;
    return res.status(200).json({ id, name, email, provider, avatarId });
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user = await User.getRepository()
      .createQueryBuilder('user')
      .where({ id: req.params.id })
      .loadAllRelationIds()
      .getOne();

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { id, name, email, provider, avatarId } = user;
    return res.status(200).json({ id, name, email, provider, avatarId });
  }

  async list(_req: Request, res: Response): Promise<Response> {
    const users = await User.getRepository()
      .createQueryBuilder()
      .loadAllRelationIds()
      .getMany();

    return res.status(200).json(users);
  }

  async update(req: Request, res: Response): Promise<Response> {
    if (!userUpdateSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    if (req.params.id !== res.locals.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    let user: User | undefined;

    if (req.body.oldPassword) {
      user = await User.getRepository()
      .createQueryBuilder('user')
      .where({ id: res.locals.id })
      .addSelect('user.password')
      .loadAllRelationIds()
      .getOne();
    } else {
      user = await User.getRepository()
        .createQueryBuilder()
        .where({ id: res.locals.id })
        .loadAllRelationIds()
        .getOne();
    }

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const { email, oldPassword } = req.body;

    if (email !== user.email) {
      const userExists = await User.getRepository()
        .createQueryBuilder()
        .where({ email })
        .getOne();

      if (userExists) {
        return res.status(409).json({ error: 'Email already in use.' });
      }
    }

    if (oldPassword && !user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Invalid or incorrect password.' });
    }

    await User.merge(user, req.body).save();

    const updatedUser = await User.getRepository()
      .createQueryBuilder()
      .where({ id: res.locals.id })
      .loadAllRelationIds()
      .getOne();

    return res.status(200).json(updatedUser);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    if (req.params.id !== res.locals.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = await User.getRepository()
      .createQueryBuilder()
      .where({ id: res.locals.id })
      .getOne();

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    await user.remove();

    return res.status(204).send();
  }

  async regenPassword(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = await User.getRepository()
      .createQueryBuilder('user')
      .where({ id })
      .addSelect('user.password')
      .loadAllRelationIds()
      .getOne();

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const password = user.regeneratePassword();
    await user.save();

    return res.status(200).json({ password });
  }
}

export default new UserController();
