import express, { request, response } from 'express';
import ProtestsController from './controllers/ProtestsController';
import SituationsController from './controllers/SituationsController';

const routes = express.Router();

const protestsControllers = new ProtestsController();
const situationsControllers = new SituationsController();

routes.get('/protests', protestsControllers.index);
routes.post('/protests', protestsControllers.create);

routes.get('/situations', situationsControllers.index);
routes.post('/situations', situationsControllers.create);

export default routes;
