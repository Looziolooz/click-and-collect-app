import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Se l'utente sta cercando di accedere a /admin...
  if (pathname.startsWith('/admin')) {
    // Controlliamo se ha il cookie di sessione
    const adminSession = req.cookies.get('admin_session');

    // Se NON ha il cookie, lo mandiamo alla pagina di login
    if (!adminSession) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Applica il middleware solo alle rotte che iniziano con /admin
export const config = {
  matcher: '/admin/:path*',
};