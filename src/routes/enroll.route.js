import express from 'express'
import enrollController from "../app/controllers/enroll.controller.js";

const enrollRouter = express.Router();

enrollRouter.post('/', enrollController.enroll)

export default enrollRouter;