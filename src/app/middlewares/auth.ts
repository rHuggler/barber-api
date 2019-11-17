import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../config/auth';

interface IDecodedToken {
    id: number;
    iat: number;
    exp?: number;
}

async function userAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.secret);
    res.locals.id = (decoded as IDecodedToken).id;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  return next();

}

export default userAuth;
