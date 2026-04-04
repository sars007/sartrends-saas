import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { generateAI } from '@/lib/ai';
import { hasSufficientCredits, deductCredits } from '@/lib/credits';

export async function POST(request: NextRequest) {
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

    // Generate response using Ollama
    const response = await generateAI(message, "llama3");
    
    // Deduct credits
    await deductCredits(userId, 2, 'AI chat');

    return NextResponse.json({ 
      content: response,
      success: true 
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate response' 
    }, { status: 500 });
  }
}

