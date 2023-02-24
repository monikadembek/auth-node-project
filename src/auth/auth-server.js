import express from 'express';
import * as dotenv from 'dotenv';
import { errorHandler } from './error-handler.js';
import { router } from './router.js';

dotenv.config();
const app = express();
const port = process.env.AUTH_SERVER_PORT || 4000;

app.use(express.json());

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('uncaught exception');
  console.error(err);
})