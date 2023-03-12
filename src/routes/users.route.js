import express from "express";

import controller from "../app/controllers/users.controller.js";

const router = express.Router();

router.get("/", controller.index);
// router.get('/signup', controller.signup);

router.get("/create", controller.getCreateUser);

router.post("/create", controller.createUser);

export default router;
