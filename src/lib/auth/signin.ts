import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

async function getStoredHashedPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function comparePassword(
  email: string,
  password: string,
  req: NextRequest,
) {
  try {
    const user = await getStoredHashedPassword(email);

    if (!user) return false;

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) return false;

    const token = jwt.sign(
      { email: user?.email },
      process.env.SECRET as string,
      { expiresIn: '15m' },
    );

    req.headers.set('authorization', `token=${token}; Path=/; HttpOnly`);

    return user;
  } catch (error) {
    return Response.json({ error: error });
  }
}
