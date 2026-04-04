import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addCredits } from '@/lib/credits'
import { getSession } from '@/lib/session'
import { cookies } from 'next/headers'

const ADMIN_IDS = process.env.ADMIN_IDS?.split(',') || []

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(cookies())
    if (!session?.user?.id || !ADMIN_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionId } = await request.json()

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'active' }
    })

    // Add credits and activate user
    const adminUser = await prisma.user.update({
      where: { id: subscription.userId },
      data: { 
        isPaid: true,
        plan: subscription.plan,
      },
      include: { subscriptions: true }
    })

    await addCredits(subscription.userId, 1000, `Subscription ${subscription.plan} activated`)

    return NextResponse.json({ success: true, user: adminUser })
  } catch (error: any) {
    console.error('[Admin Verify] Error:', error.message)
    return NextResponse.json({ error: 'Verification failed', details: error.message }, { status: 500 })
  }
}
