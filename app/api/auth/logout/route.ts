import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    request.headers.set('authorization', `token=''; Path=/; HttpOnly`);

    return Response.json({ success: true, message: 'logged out' });
  } catch (error) {
    return Response.json({ error: 'internal server error' });
  }
}
