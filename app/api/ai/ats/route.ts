import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { atsCheck } from '@/lib/ai-fixed';

export async function POST(req: NextRequest) {
console.log('START AI GEN');
  try {
    const cookieStore = cookies();
    const session = await getSession(cookieStore);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeText, jobDesc } = await req.json();
    if (!resumeText || !jobDesc) {
      return NextResponse.json({ error: 'Resume text and job description are required' }, { status: 400 });
    }

    const atsResult = await atsCheck(session.user.id, resumeText, jobDesc);
    
console.log('DONE AI GEN');
    return NextResponse.json({ result: atsResult });
  } catch (error: any) {
    console.log('ERROR AI GEN');
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
