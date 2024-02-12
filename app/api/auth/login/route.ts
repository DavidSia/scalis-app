import { comparePassword } from '@/src/lib/auth/signin';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email,password are required.' });
    }

    const user = await comparePassword(email, password, request);

    return Response.json({ success: !!user, user });
  } catch (error) {
    return Response.json({ error: 'Invalid credentials.' });
  }
}
