import { PrismaClient } from '@prisma/client';

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
