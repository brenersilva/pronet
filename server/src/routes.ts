import express, { request, response } from 'express';
import ProtestsController from './controllers/ProtestsController';

const routes = express.Router();
const protestsControllers = new ProtestsController();

routes.get('/protests', protestsControllers.index);
routes.post('/protests', protestsControllers.create);

export default routes;
