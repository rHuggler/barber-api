import jwt from 'jsonwebtoken';

import User from '../entity/user';

import { Request, Response } from 'express';

class SessionController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const user: User | undefined = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.'});
    }

    const passwordMatches: boolean = user.checkPassword(password);

    if (!passwordMatches) {
      return res.status(403).json({ error: 'Invalid or incorrect password.' });
    }

    const { id, name } = user;

    return res.json({
      token: jwt.sign({ id }, 's3cr3t', { expiresIn: '7d' }),
      user: { email, id, name },
    });

  }
}

export default new SessionController();
