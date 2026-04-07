import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from './lib/auth'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value

  // Public paths
  if (req.nextUrl.pathname.startsWith('/api/auth') || req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Protect dashboard and api
  if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/api/ai') || req.nextUrl.pathname.startsWith('/api/user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    const payload = verifyJWT(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/auth/login', req.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

