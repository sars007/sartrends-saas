import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { generateCoverLetter } from '@/lib/ai-fixed';

export async function POST(req: NextRequest) {
console.log('START AI GEN');
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
    
console.log('DONE AI GEN');
    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.log('ERROR AI GEN');
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
