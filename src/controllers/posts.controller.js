import { Router } from 'express';
import { tokenAuthenticate } from '../middleware/token-authentication.middleware.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { canDeletePost, canViewPost } from '../permissions/posts-permissions.js';

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

postsController.get('/:id', tokenAuthenticate, async (req, res) => {
  const postId = +req.params.id;
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId
    }
  });
  if (!canViewPost(req.user, post)) {
    return res.status(203).json( { message: 'Not sufficient permissions to see this post' });
  }
  return res.status(200).json({ 'post': post });
});

postsController.post('', tokenAuthenticate, async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user;
  let post;

  if (title && content) {
    post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: id
      }
    }).catch((error) => {
      console.log('Error with adding new post', error);
      return res.status(500).json({ error: "Error occured while adding new post" });
    });
    return res.status(200).json({ post });
  } else {
    return res.status(400).json({ error: "Title and content are required" });
  }
});

postsController.delete('/:id', tokenAuthenticate, async (req, res) => {
  const postId = +req.params.id;
  const user = req.user;

  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId
    }
  }).catch(error => {
    console.log('err:', error);
    if (error instanceof Prisma.NotFoundError) {
      return res.status(404).json({ error: 'Post not found '});
    }
  });

  if (!canDeletePost(user, post)) {
    return res.status(403).json({ message: 'Not sufficient permissions to delete post' });
  }

  await prisma.post.delete({
    where: {
      id: postId
    } 
  }).catch(error => {
    console.log('err:', error);
    return res.status(500).json({ error: 'Error occured while deleting post' });
  });

  return res.status(200).json({ message: 'Post deleted' });
});