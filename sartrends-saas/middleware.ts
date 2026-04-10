import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { Role } from '@prisma/client'

const protectedRoutes = ['/dashboard', '/loadboard', '/drivers', '/admin']
const authPages = ['/login', '/register']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  const url = req.nextUrl.pathname

  const isProtected = protectedRoutes.some(route => url.startsWith(route))
  const isAuthPage = authPages.some(route => url.startsWith(route))

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return null
  }

  if (!isProtected) return null

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const payload = verifyJWT(token)
  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('auth-token', '', { maxAge: 0 })
    return res
  }

  // Session validation
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  // Note: client should send sessionId/deviceId header, for demo skip full validate

  // Check subscription
  // In full, get user sub from payload, check expiry/active

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}
