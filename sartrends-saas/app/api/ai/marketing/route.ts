import { NextRequest, NextResponse } from 'next/server'
import { generateAI } from '@/lib/ai'
import { deductCredits } from '@/lib/credits'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

const user = await requireUser()
    const userId = user.id
    
    // Admin bypass credits
    if (!user.isAdmin) {
      await deductCredits(userId, 1, 'AI marketing generation')
    }

    const result = await generateAI(prompt, 'gpt-4o-mini')

    // Log usage
    await prisma.aIRequestLog.create({
      data: {
        userId,
        prompt,
        response: result,
      }
    })

    return NextResponse.json({ 
      result,
      creditsLeft: user.credits 
    })

  } catch (error: any) {
    console.log('AI marketing error:', error.message)
    return NextResponse.json({ 
      error: 'Generation failed. Try again.',
      result: ''
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}

