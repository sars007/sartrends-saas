import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(cookies);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, credits: true, isPaid: true, plan: true, createdAt: true }
    });

    return NextResponse.json({ profile: userProfile });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(cookies);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ profile: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
