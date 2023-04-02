import express from "express";
import FormValidator from "../validate/form.validate.js"
import createUserValidationStrategy from "../validate/users.validate.js";
import controller from "../app/controllers/users.controller.js";
import privilege from "../middlewares/privilege.middleware.js";

const router = express.Router();

router.get("/", controller.index);

router.get("/create", privilege, controller.getCreateUser);

const createUserFormValidator = new FormValidator(createUserValidationStrategy);
router.post("/create", createUserFormValidator.validateForm(), controller.createUser);

export default router;
