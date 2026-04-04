import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEFAULT_TEMPLATES = [
  { name: 'Modern Resume', type: 'resume', content: 'Modern resume with clean sections.', isPremium: false },
  { name: 'ATS Friendly', type: 'resume', content: 'ATS-optimized resume.', isPremium: false },
  { name: 'Executive Resume', type: 'resume', content: 'Executive-level resume.', isPremium: true },
  { name: 'Risk Assessment', type: 'hse', content: 'HSE risk assessment document.', isPremium: false },
  { name: 'Cover Letter', type: 'cover', content: 'Professional cover letter.', isPremium: false },
  { name: 'Method Statement', type: 'hse', content: 'HSE method statement.', isPremium: true }
]

export async function GET() {
  try {
    let templates = await prisma.template.findMany({
      select: { id: true, name: true, type: true, isPremium: true },
      orderBy: { createdAt: 'desc' }
    })
    
    if (templates.length === 0) {
      console.log('[Templates] Seeding default templates...')
      try {
        await Promise.all(
          DEFAULT_TEMPLATES.map(t => 
            prisma.template.upsert({
              where: { name_type: { name: t.name, type: t.type } },
              update: {},
              create: t
            })
          )
        )
        templates = await prisma.template.findMany({
          select: { id: true, name: true, type: true, isPremium: true },
          orderBy: { createdAt: 'desc' }
        })
      } catch (seedErr: any) {
        console.error('[Templates] Seeding error:', seedErr.message)
      }
    }
    
    return NextResponse.json({ success: true, templates })
  } catch (error: any) {
    console.error('[Templates] Error:', error.message, error.stack)
    return NextResponse.json({ error: 'Failed to fetch templates', details: error.message }, { status: 500 })
  }
}
