import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('auth_session')?.value ?? null;
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ['/', '/login', '/register', '/auth/login', '/auth/register', '/contact', '/services', '/api/', '/ai'];
  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'));
  
  if (isPublic) {
    return NextResponse.next();
  }

  // For protected routes, check session
  if (!sessionId) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/modules/:path*', '/dashboard/:path*', '/admin/:path*']
}


