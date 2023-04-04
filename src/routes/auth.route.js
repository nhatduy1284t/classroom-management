import express from "express";

import controller from "../app/controllers/auth.controller.js";

const router = express.Router();

router.get("/login", controller.login);
router.get("/logout", controller.logout);

router.post("/login", controller.postLogin);
router.post("/changepassword", controller.changePassword);
export default router;

