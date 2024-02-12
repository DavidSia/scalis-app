import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@mail',
    password_hash: bcrypt.hashSync('123456abc', 10),
    accounts: {
      create: [
        {
          type: 'saving',
          balance: 233,
        },
        {
          type: 'checking',
          balance: 20,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@mail',
    password_hash: bcrypt.hashSync('123456abc', 10),
    accounts: {
      create: [
        {
          type: 'saving',
          balance: 333,
        },
        {
          type: 'checking',
          balance: 30,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@mail',
    password_hash: bcrypt.hashSync('123456abc', 10),
    accounts: {
      create: [
        {
          type: 'saving',
          balance: 433,
        },
        {
          type: 'checking',
          balance: 40,
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
