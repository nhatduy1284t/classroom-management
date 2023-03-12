import express from 'express'

import homeController from '../app/controllers/home.controller.js';

const homeRouter = express.Router();


homeRouter.get('/', homeController.dashboard)


export default homeRouter;