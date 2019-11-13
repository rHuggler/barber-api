import { Request, Response } from 'express';

import File from '../entities/models/File';

class FileController {
  async create(req: Request, res: Response): Promise<Response> {
    const { originalname: name, filename: path } = req.file;

    const file = File.create({ name, path });
    await file.save();

    return res.status(200).json({ file });
  }
}

export default new FileController();
