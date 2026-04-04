import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';
import { generateDocument, generateHSE } from '@/lib/ai-fixed';  // Use fixed AI
import { hasSufficientCredits } from '@/lib/credits';

export async function POST(request: NextRequest) {
console.log('START AI GEN');
  try {
    const session = await getSession(cookies())
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { type, details, templateId, docType, jobDesc } = await request.json();

    // Premium/credits check for HSE/document (5 credits) - deduct handled in lib/ai
    if (type === 'hse' || type === 'document') {
      const hasCredits = await hasSufficientCredits(userId, 5);
      if (!hasCredits) {
        return NextResponse.json({ error: 'Insufficient credits. Upgrade or earn more.' }, { status: 402 });
      }
    }

    let content: string;
    switch (type) {
      case 'hse':
        content = await generateHSE(userId, docType || 'risk', details);
        break;
      case 'document':
        content = await generateDocument(userId, details.type || 'hse', details);
        break;
      default:
        return NextResponse.json({ error: 'Invalid or unsupported type' }, { status: 400 });
    }

    // Save to Documents
    const doc = await prisma.document.create({
      data: {
        userId,
        templateId: templateId ? templateId : undefined,
        type,
        title: details.title || `${type} Document`,
        content: { raw: content, parsed: {} } as any,
      }
    });

console.log('DONE AI GEN');
    return NextResponse.json({ success: true, content, documentId: doc.id });
  } catch (error: any) {
    console.log('ERROR AI GEN');
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
