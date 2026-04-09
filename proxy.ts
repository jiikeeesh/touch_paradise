import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin-token')?.value;

    if (token === 'authenticated') {
      return NextResponse.next();
    }

    // Redirect to root login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};

