import express from 'express'

import controller from '../app/controllers/auth.controller.js'

const router = express.Router();

router.get('/login', controller.login);

// router.post('/login', controller.postLogin);

export default router;