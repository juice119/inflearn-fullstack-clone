import { getSession } from '@/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // TODO: 로그인 로직 연결
  const session = await getSession(request);

  if (!session?.user) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/instructor/:path*',
    '/create_courses',
    '/course/:id/edit/:path*',
    '/course/:id/learn/:path*',
  ],
};
