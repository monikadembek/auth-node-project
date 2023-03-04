import express from 'express';
import * as dotenv from 'dotenv';
import { tokenAuthenticate } from './middleware/token-authentication.middleware.js';
import { Router } from 'express';
import { postsController } from './controllers/posts.controller.js';

const router = new Router();

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(router);
router.use('/posts', postsController);

app.get('', (req, res) => {
  res.send('Home Page');
});

app.get('/admin', tokenAuthenticate, (req, res) => {
  res.send('Admin page');
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('uncaught exception');
  console.error(err);
});