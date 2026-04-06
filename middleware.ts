import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    // Exclude the login page itself from authentication
    if (url.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get('admin-token')?.value;

    if (token === 'authenticated') {
      return NextResponse.next();
    }

    // Redirect to custom login page
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};

