import express from "express";
import assignmentController from "../app/controllers/assignment.controller.js";

const assignmentRouter = express.Router();

assignmentRouter.get("/:assignmentId", assignmentController.getAssignment);
assignmentRouter.post("/create", assignmentController.createAssignment);
assignmentRouter.post("/submit", assignmentController.submitAssignment);
assignmentRouter.post("/submit/grade", assignmentController.grade);
assignmentRouter.post("/changesubmit", assignmentController.changeSubmitAssignment);

export default assignmentRouter;
