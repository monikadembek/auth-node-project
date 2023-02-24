import { Prisma } from '@prisma/client';
import { ValidationError } from 'express-json-validator-middleware';
import { mapErrors } from './middlewares/validation.middleware.js';

export function errorHandler(err, req, res, next) {
  console.log(err);
  let { message, stack = '', status = 500, errors } = err;
  stack = stack.split('\n');

  if (err instanceof Prisma.NotFoundError) {
    status = 404;
  }

  if (err instanceof ValidationError) {
    status = 400;
    errors = mapErrors(err.validationErrors.body);
  }

  res.status(status).json({ message, stack, errors });
}