import express from "express";
import assignmentController from "../app/controllers/assignment.controller.js";
import FormValidator from "../validate/form.validate.js"
import createAssignValidationStrategy from "../validate/assignment.validate.js";

const assignmentRouter = express.Router();

assignmentRouter.get("/:assignmentId", assignmentController.getAssignment);

const assignmentFormValidator = new FormValidator(createAssignValidationStrategy);
assignmentRouter.post("/create", assignmentFormValidator.validateForm(), assignmentController.createAssignment);

assignmentRouter.post("/submit", assignmentController.submitAssignment);
assignmentRouter.post("/changesubmit", assignmentController.changeSubmitAssignment);

export default assignmentRouter;
