import express from 'express'
import assignmentController from '../app/controllers/assignment.controller.js';
import classController from '../app/controllers/class.controller.js';

const classRouter = express.Router();

classRouter.post('/assignment/create', assignmentController.createAssignment);
classRouter.post('/assignment/submit', assignmentController.submitAssignment);
classRouter.post('/create', classController.createClass);
classRouter.post('/:id/assign',classController.assignClass)

classRouter.get('/', classController.getClasses)
classRouter.get('/:id', classController.getClass)

export default classRouter;