import { Router } from 'express';
import { registerSchema } from '../dto-schema/register-dto.schema.js';
import { validatorMiddleware } from '../middlewares/validation.middleware.js';
import * as UsersService from '../services/users.service.js';
import bcrypt from 'bcrypt';

export const usersController = new Router();

usersController.get('', async (req, res) => {
  let users = [];
  users = await UsersService.getUsers()
    .catch((e) => { 
      console.error(e); 
      res.status(500).json({ error: 'Couldn\'t retrieve data from database' });
    });
  res.status(200).json({ users });
});

usersController.post(
  '/register', 
  validatorMiddleware({ body: registerSchema }), 
  async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UsersService.registerUser(email, hashedPassword, name)
      .catch((e) => { 
        console.error(e); 
        res.status(500).json({ error: 'Couldn\'t save user in database' });
      });
    res.status(201).json({ user });
  }
);