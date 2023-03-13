import express from "express";
import validate from "../validate/users.validate.js"
import controller from "../app/controllers/users.controller.js";
import privilege from "../middlewares/privilege.middleware.js";

const router = express.Router();

router.get("/", controller.index);
// router.get('/signup', controller.signup);

router.get("/create", privilege, controller.getCreateUser);

router.post("/create", validate, controller.createUser);

export default router;
