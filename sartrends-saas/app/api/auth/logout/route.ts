import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/session'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.body?.sessionId as string // client sends
    if (sessionId) {
      await logout(sessionId)
    }
    const res = NextResponse.json({ success: true })
    res.cookies.set('auth-token', '', { maxAge: 0 })
    return res
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

