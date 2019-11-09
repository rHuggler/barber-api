import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/authConfig';
import User from '../entities/User';
import { sessionSchema } from './validators/sessionValidator';

class SessionController {
  async create(req: Request, res: Response) {
    if (!sessionSchema.isValidSync(req.body)) {
      return res.status(400).json({ error: 'Incorrect or missing payload.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, select: ['id', 'name', 'password'] });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const passwordMatches = user.checkPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid or incorrect password.' });
    }

    const { id, name } = user;

    return res.json({
      user: { email, id, name },
      token: jwt.sign({ id }, authConfig.secret, authConfig.signOptions),
    });

  }
}

export default new SessionController();
