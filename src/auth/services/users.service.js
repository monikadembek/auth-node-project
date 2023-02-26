import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function getUsers() {
  return await prisma.user.findMany({});
}

export async function registerUser(email, password, name = '') {
  return await prisma.user.create({
    data: {
      email: email,
      password: password,
      name: name,
    }
  });
}

export async function getUser(email, password) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    }
  });
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    return user;
  } else {
    const error = new Error('Wrong password');
    error.statusCode = 401;
    throw error;
  }
}

export async function saveRefreshToken(token) {
  return await prisma.refreshTokenStorage.create({
    data: {
      token: token
    }
  });
}

export async function removeRefreshToken(token) {
  return await prisma.refreshTokenStorage.delete({ 
    where: {
      token: token
    }
  });
}