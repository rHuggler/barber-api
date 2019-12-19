import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import Youch from 'youch';

export default async function youch(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  const errors = await new Youch(err, req).toJSON();

  return res.status(500).json(errors);
}
