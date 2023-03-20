import express from "express";
import assignmentController from "../app/controllers/assignment.controller.js";
import classController from "../app/controllers/class.controller.js";
import privilege from "../middlewares/privilege.middleware.js";

const classRouter = express.Router();

classRouter.post("/assignment/create", assignmentController.createAssignment);
classRouter.post("/assignment/submit", assignmentController.submitAssignment);
classRouter.post("/create", classController.postCreateClass);
classRouter.post("/:id/assign", classController.assignClass);
classRouter.post("/:id/unassign/:userId", classController.unassignClass);


classRouter.get("/:id", classController.getClass);

classRouter.get("/", classController.getClasses);

// classRouter.get('/:id', classController.id);
// classRouter.get('/create', classController.createClass);
// classRouter.post('/create', classController.postCreateClass);
classRouter.get("/search", classController.search);

export default classRouter;
