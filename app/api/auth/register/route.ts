import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        credits: 50,
        isPaid: false,
        plan: 'free',
      },
    });

    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: 50,
        type: 'earn',
        reason: 'Welcome bonus',
      },
    });

    const session = await auth.createSession(user.id, {}, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, credits: user.credits }
    });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
