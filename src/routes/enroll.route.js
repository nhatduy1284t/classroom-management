import express from 'express'
import enrollController from "../app/controllers/enroll.controller";

const enrollRouter = express.Router();

enrollRouter.post('/', enrollController.enroll)

export default enrollRouter;