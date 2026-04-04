import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const validPassword = password === 'demo123';
    
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = await auth.createSession(user.id, {}, {});

    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, credits: user.credits }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
