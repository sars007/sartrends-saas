import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { getUserCredits } from '@/lib/credits';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(cookies);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const credits = await getUserCredits(session.user.id);
    return NextResponse.json({ credits, userId: session.user.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
