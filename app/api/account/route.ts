import prisma from '@/src/lib/prisma';

export async function GET() {
  const accounts = await prisma.account.findMany();

  return Response.json(accounts);
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const promises = [];
    for (const account of data) {
      promises.push(
        prisma.account.update({
          where: {
            id: account.id,
          },
          data: {
            balance: account.balance,
          },
        }),
      );
    }
    const accounts = await Promise.all(promises);

    return Response.json({ success: true, accounts });
  } catch (error) {
    return Response.json({
      success: false,
      error:
        'An error occurred while updating accounts. Please try again later.',
    });
  }
}
