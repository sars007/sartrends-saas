import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, verifyPassword, createJWT, createSession } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import type { User } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string }
    const user = await getUserByEmail(email)
    if (!user || !await verifyPassword(user.password, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const ip = headers().get('x-forwarded-for') || headers().get('x-real-ip') || 'unknown'
    const session = await createSession({ userId: user.id, ip })

    // Create JWT
    const token = createJWT(user)

    const res = NextResponse.json({ success: true, sessionId: session.id, deviceId: session.deviceId, role: user.role })
    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
