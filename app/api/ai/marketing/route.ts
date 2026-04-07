import { NextRequest, NextResponse } from 'next/server'
import { generateAI } from '@/lib/ai'
import { deductCredits } from '@/lib/credits'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    // Mock user for now, replace with auth later
    const mockUserId = 'user123'
    
    // Admin bypass credits
    const user = await prisma.user.findUnique({ where: { id: mockUserId } })
    if (!user?.isAdmin) {
      await deductCredits(mockUserId, 1, 'AI marketing generation')
    }

    const result = await generateAI(prompt, 'gpt-4o-mini')

    // Log usage
    await prisma.aIRequestLog.create({
      data: {
        userId: mockUserId,
        prompt,
        response: result,
      }
    })

    return NextResponse.json({ 
      result,
      creditsLeft: user?.credits || 10 
    })

  } catch (error: any) {
    console.error('AI marketing error:', error)
    return NextResponse.json({ 
      error: 'Generation failed',
      result: `Fallback marketing copy for "${prompt || 'product'}"

✔ High quality product
✔ Great price
✔ Trusted brand

Get yours today!`
    }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}

