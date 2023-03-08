import express from 'express'

import controller from '../app/controllers/users.controller.js'

const router = express.Router();

router.get('/', controller.index);
router.get('/signup', controller.signup);

router.post('/create', 
    controller.create
);



export default router;