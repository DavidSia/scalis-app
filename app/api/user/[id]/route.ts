import prisma from '@/src/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: 'id is required.' });
    }

    const user = await prisma.user.findUnique({
      include: {
        accounts: true,
      },
      where: {
        id,
      },
    });

    if (!id) {
      return Response.json({ message: 'user not found.' });
    }

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({
      success: false,
      error: 'An error occurred while search the user.',
    });
  }
}
