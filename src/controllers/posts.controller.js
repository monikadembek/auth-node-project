import { Router } from 'express';
import { tokenAuthenticate } from '../middleware/token-authentication.middleware.js';
import { PrismaClient } from '@prisma/client';

export const postsController = new Router();

const prisma = new PrismaClient()

postsController.get('', tokenAuthenticate, async (req, res) => {
  const userPosts = await prisma.post.findMany({
    where: {
      authorId: req.user.id
    }
  });
  return res.status(200).json({ 'posts': userPosts });
});