import { NextRequest, NextResponse } from 'next/server'
import { createUser, createJWT, createSession } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json() as { name: string; email: string; password: string; role?: string }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 })

    const user = await createUser({ name, email, password, role: role as any })

    const ip = headers().get('x-forwarded-for') || 'unknown'
    const session = await createSession({ userId: user.id, ip })

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

