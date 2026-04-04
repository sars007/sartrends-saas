import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { generateAI } from '@/lib/ai-fixed';
import { hasSufficientCredits, deductCredits } from '@/lib/credits';

export async function POST(request: NextRequest) {
console.log('START AI GEN');
  try {
    const session = await getSession(cookies());
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { message } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check credits
    if (!await hasSufficientCredits(userId, 2)) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        code: 'INSUFFICIENT_CREDITS' 
      }, { status: 400 });
    }

    const useStream = request.nextUrl.searchParams.get('stream') === 'true';
    let response: string;
    try {
      if (useStream) {
        // Use stream, but since POST response is JSON, fallback to non-stream for simplicity
        response = await generateAI(message, "llama3", true);
      } else {
        response = await generateAI(message, "llama3");
      }
    } catch (streamError) {
      console.log('Stream failed, fallback non-stream');
      response = await generateAI(message, "llama3");
    }
    
    // Deduct credits
    await deductCredits(userId, 2, 'AI chat');

console.log('DONE AI GEN');
    return NextResponse.json({ 
      content: response,
      success: true 
    });

  } catch (error: any) {
    console.log('ERROR AI GEN');
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
