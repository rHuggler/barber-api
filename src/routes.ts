import { Router } from 'express';

import userController from './app/controller/userController';

const routes = Router();

routes.route('/users')
  .get(userController.list)
  .post(userController.create);

routes.route('/users/:id')
  .get(userController.show)
  .put(userController.update)
  .delete(userController.delete);


export default routes;
