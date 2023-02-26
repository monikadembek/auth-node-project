import { Router } from 'express';
import { registerSchema } from '../dto-schema/register-dto.schema.js';
import { loginSchema } from '../dto-schema/login-dto.schema.js';
import { validatorMiddleware } from '../middlewares/validation.middleware.js';
import * as UsersService from '../services/users.service.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken'; 

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

usersController.post(
  '/login', 
  validatorMiddleware({ body: loginSchema }), 
  async (req, res) => {
    const { email, password } = req.body;

    const user = await UsersService.getUser(email, password)
      .catch((error) => { 
        console.error('Error (users controller): ', error); 
        if (error instanceof Prisma.NotFoundError) {
          return res.status(404).json({ error: 'No user found' });
        }
        if (error.message === 'Wrong password') {
          return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Couldn\'t retrieve data from database' });
      });

    const userData = { 
      id: user.id,
      email: user.email
    }

    const accessToken = jwt.sign(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s'}
    );
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
    
    // TODO: save refresh token to redis in future
    await UsersService.saveRefreshToken(refreshToken)
      .catch(error => {
        console.log(error);
      });
    
    return res.status(200).json({ accessToken, refreshToken });
});

// remove refresh token to revoke access to protected routes
// logout - remove refresh token from list of valid refresh tokens
// so we no longer can generate access token with that refresh token
usersController.delete('/logout', async (req, res) => {
  const { token } = req.body;
  await UsersService.removeRefreshToken(token)
    .catch(error => {
      console.log(error);
      return res.status(500).json({ 'error': 'Removing token failed' });
    });
  return res.status(200).json({ 'message': 'Token removed' });
});

// get new access token by providing valid refresh token
usersController.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(201).json({ 'message': 'No refresh token provided' });
  }

  // check if this refresh token exists in db, if the token is still valid
  const tokenExists = await UsersService.getRefreshToken(refreshToken);
  if (!tokenExists) {
    return res.status(403).json({ message: 'Refresh token doesn\'t exist' });
  }

  // verify provided refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 'message': 'invalid refresh token' });
    }
    // generate new access token
    const userData = {
      id: user.id,
      email: user.email
    }
    const accessToken = jwt.sign(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s'}
    );
    return res.status(200).json({ accessToken });
  });
});
