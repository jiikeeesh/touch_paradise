import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin-token')?.value;

    if (token !== 'authenticated') {
      // Create the login URL
      const loginUrl = new URL('/login', req.url);
      
      // Keep track of where the user was trying to go
      loginUrl.searchParams.set('from', url.pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
