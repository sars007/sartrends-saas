import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { atsCheck } from '@/lib/ai-fixed';

export async function POST(req: NextRequest) {
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
    
    return NextResponse.json({ result: atsResult });
  } catch (error: any) {
    console.error('ATS Check API error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

