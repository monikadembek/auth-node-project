import { Router } from 'express';
import { usersController } from './controllers/users.controller.js';

export const router = new Router();

router.use('/users', usersController);