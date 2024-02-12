import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, name, password, accounts } = await request.json();

    if (!email || !name || !password || !accounts) {
      return Response.json({
        error: 'Email, name, password and accounts are required.',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({
        error: 'A user with this email already exists.',
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password_hash: bcrypt.hashSync(password, 10),
      },
    });

    for (const account of accounts) {
      await prisma.account.create({
        data: {
          type: account.type,
          balance: account.initialBalance,
          ownerId: user.id,
        },
      });
    }

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({
      success: false,
      error:
        'An error occurred while creating the user. Please try again later.',
    });
  }
}

export async function GET() {
  const accounts = await prisma.user.findMany();

  return Response.json(accounts);
}
