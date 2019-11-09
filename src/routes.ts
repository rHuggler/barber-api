import { Router } from 'express';
import multer from 'multer';

import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import userAuth from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.route('/users')
  .get(UserController.list)
  .post(UserController.create);

routes.route('/users/:id')
  .get(UserController.show)
  .delete([userAuth], UserController.delete)
  .put([userAuth], UserController.update);

routes.route('/users/:id/password')
  .get(UserController.regenPassword);

routes.route('/providers')
  .get(ProviderController.list);

routes.route('/sessions')
  .post(SessionController.create);

routes.route('/appointments')
  .post([userAuth], AppointmentController.create);

routes.route('/files')
  .post(upload.single('file'), FileController.create);

export default routes;
