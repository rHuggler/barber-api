import { Router } from 'express';

const routes = Router();

routes.get('/', (_, res) => {
    return res.json({ hello: 'world'});
});

export default routes;
