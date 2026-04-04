import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { generateCoverLetter } from '@/lib/ai-fixed';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const session = await getSession(cookieStore);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { details } = await req.json();
    if (!details || typeof details !== 'object') {
      return NextResponse.json({ error: 'Invalid details' }, { status: 400 });
    }

    const coverLetter = await generateCoverLetter(session.user.id, details);
    
    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error('Cover Letter API error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

