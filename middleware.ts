import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Se non stiamo cercando di accedere a /admin, lascia passare
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Leggiamo l'header di autorizzazione
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // CREDENZIALI ADMIN (Puoi cambiarle qui o metterle in .env)
    if (user === 'vincenzo' && pwd === 'pesce2024') {
      return NextResponse.next();
    }
  }

  // Se non autorizzato, chiedi password
  return new NextResponse('Autenticazione Richiesta', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Area Riservata Pescheria"',
    },
  });
}

// Applica il middleware solo alle rotte che iniziano con /admin
export const config = {
  matcher: '/admin/:path*',
};