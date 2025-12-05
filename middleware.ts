import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protezione Rotte Admin
  if (pathname.startsWith('/admin')) {
    // Controlliamo se esiste il cookie di sessione
    const adminSession = req.cookies.get('admin_session');

    // Se NON c'è il cookie, reindirizza alla pagina di login
    if (!adminSession) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // 2. Redirect se già loggato
  // Se l'admin è già loggato e prova ad andare su /login, mandalo direttamente alla dashboard
  if (pathname.startsWith('/login')) {
     const adminSession = req.cookies.get('admin_session');
     if (adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  // Specifica su quali rotte deve agire il middleware
  matcher: ['/admin/:path*', '/login'],
};