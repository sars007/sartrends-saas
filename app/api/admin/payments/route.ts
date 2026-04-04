import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(cookies());
    if (!session || session.user.email !== 'admin@sartrends.ai') {
      return NextResponse.json({ error: 'Admin only' }, { status: 401 });
    }

    const payments = await prisma.subscription.findMany({
      where: {
        status: { in: ['pending'] }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

