import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/authConfig';
import User from '../entity/user';

class SessionController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User does not exists.'});
    }

    const passwordMatches = user.checkPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid or incorrect password.' });
    }

    const { id, name } = user;

    return res.json({
      token: jwt.sign({ id }, authConfig.secret, authConfig.signOptions),
      user: { email, id, name },
    });

  }
}

export default new SessionController();
