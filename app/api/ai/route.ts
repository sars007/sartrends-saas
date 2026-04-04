import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { generateResume, generateCoverLetter, generateDocument, generateHSE, atsCheck } from '@/lib/ai';
import { getUserCredits, hasSufficientCredits } from '@/lib/credits';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(cookies())
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { type, details, templateId, docType, jobDesc } = await request.json();

    let content: string;
    switch (type) {
      case 'hse':
        content = await generateHSE(userId, docType || 'risk', details, templateId);
        break;
      case 'document':
        content = await generateDocument(userId, details.type || 'hse', details);
        break;
      case 'ats':
        content = await atsCheck(userId, details.resumeText, jobDesc);
        break;
      default:
        return NextResponse.json({ error: 'Invalid or unsupported type' }, { status: 400 });
    }

    // Save to Documents
    const doc = await prisma.document.create({
      data: {
        userId,
        templateId: templateId || '',
        type,
        title: details.title || `${type} Document`,
        content: { raw: content, parsed: {} } as any,
      }
    });

    return NextResponse.json({ success: true, content, documentId: doc.id });
  } catch (error: any) {
    console.error('[AI Route] Error:', error);
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 400 });
  }
}


