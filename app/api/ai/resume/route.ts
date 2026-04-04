import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { generateResume } from '@/lib/ai-fixed';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const session = await getSession(cookieStore);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { details, templateId } = await req.json();
    if (!details || typeof details !== 'object') {
      return NextResponse.json({ error: 'Invalid details' }, { status: 400 });
    }

    const resumeHtml = await generateResume(session.user.id, details, templateId);
    
    return NextResponse.json({ resume: resumeHtml });
  } catch (error: any) {
    console.error('Resume API error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
