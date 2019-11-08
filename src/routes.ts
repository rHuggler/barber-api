import { Router } from 'express';

import sessionController from './app/controllers/sessionController';
import userController from './app/controllers/userController';
import userAuth from './app/middlewares/auth';

const routes = Router();

routes.route('/users')
  .get(userController.list)
  .post(userController.create);

routes.route('/users/:id')
  .get(userController.show)
  .delete([userAuth], userController.delete)
  .put([userAuth], userController.update);

routes.route('/sessions')
  .post(sessionController.create);

export default routes;
