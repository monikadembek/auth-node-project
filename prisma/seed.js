import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const genPassword = (password) => bcrypt.hash(password, 10);

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  const user1 = await prisma.user.create({
    data: 
      {
        email: 'mina@gmail.com',
        password: await genPassword('zaq1@WSX'),
        name: 'Mina',
        posts: {
          create: [
            {
              title: 'First post',
              content: 'Some content of first post'
            },
            {
              title: 'Second post',
              content: 'Content of second post'
            }
          ]
        }
      }
  });
  console.log('user2 table: ', user1);

  const user2 = await prisma.user.create({
    data: 
      {
        email: 'johnDoe@gmail.com',
        password: await genPassword('zaq1@WSX'),
        name: 'John Doe',
        posts: {
          create: [
            {
              title: 'John\'s first post',
              content: 'Some content of first post'
            },
            {
              title: 'Second post of John',
              content: 'Content of second post'
            }
          ]
        }
      }
  });
  console.log('user2 table: ', user2);

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        password: await genPassword('zaq1@WSX'),
        name: 'Admin',
        role: Role.ADMIN
      },
      {
        email: 'janeDoe@gmail.com',
        password: await genPassword('zaq1@WSX'),
        name: 'Jane Doe'
      }
    ]
  });
  console.log('users table: ', users);
}

main()
  .then( async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });