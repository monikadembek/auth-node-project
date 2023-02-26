import express from 'express';
import * as dotenv from 'dotenv';
import { tokenAuthenticate } from './middleware/token-authentication.middleware.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/posts', tokenAuthenticate, async (req, res) => {
  const userPosts = await prisma.post.findMany({
    where: {
      authorId: req.user.id
    }
  });
  return res.status(200).json({ 'posts': userPosts });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});