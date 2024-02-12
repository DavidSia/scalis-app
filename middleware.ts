import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const privateRoute = ['/user'];

  const isPrivateRoute = privateRoute.includes(req.nextUrl.pathname);

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const secret = process.env.SECRET as string;

    jwt.verify(token, secret);

    return NextResponse.next();
  } catch (error) {
    return Response.json({ message: 'Failed to authenticate token' });
  }
}
