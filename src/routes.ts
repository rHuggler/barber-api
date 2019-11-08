import { Router } from 'express';

import sessionController from './app/controller/sessionController';
import userController from './app/controller/userController';
import userAuth from './app/middleware/auth';

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
