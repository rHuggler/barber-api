import { Router } from 'express';
import multer from 'multer';

import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import ScheduleController from './app/controllers/ScheduleController';
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

routes.route('/providers/:id/available')
  .get(ProviderController.available);

routes.route('/sessions')
  .post(SessionController.create);

routes.route('/files')
  .post(upload.single('file'), FileController.create);

routes.route('/appointments')
  .post([userAuth], AppointmentController.create)
  .get([userAuth], AppointmentController.list);

routes.route('/appointments/:id')
  .delete([userAuth], AppointmentController.delete)
  .get([userAuth], AppointmentController.show);

routes.route('/schedules')
  .get([userAuth], ScheduleController.list);

routes.route('/notifications')
  .get([userAuth], NotificationController.list);

routes.route('/notifications/:id')
  .put([userAuth], NotificationController.update);

export default routes;
