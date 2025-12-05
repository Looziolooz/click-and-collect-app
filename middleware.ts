import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protezione Admin: Se non hai il cookie, vai al login
  if (pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  // 2. Redirect Login: Se hai già il cookie, vai alla dashboard
  if (pathname.startsWith('/login')) {
     const adminSession = req.cookies.get('admin_session');
     if (adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};