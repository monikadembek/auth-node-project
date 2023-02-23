import express from 'express';
import * as dotenv from 'dotenv';
import { registerSchema } from './dto-schema/register-dto.schema.js';
import { validatorMiddleware } from './middlewares/validation.middleware.js';
import { errorHandler } from './error-handler.js';

dotenv.config();
const app = express();
const port = process.env.AUTH_SERVER_PORT || 4000;

app.use(express.json());

app.post('/users/register', validatorMiddleware({ body: registerSchema }), (req, res) => {
  console.log(req.body);
  res.status(201).json(req.body);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('uncaught exception');
  console.error(err);
})