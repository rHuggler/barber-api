import crypto from 'crypto';
import multer from 'multer';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (_req, file, cb) => {
      const random = crypto.randomBytes(16);
      return cb(null, random.toString('hex') + extname(file.originalname));
    },
  }),
};
