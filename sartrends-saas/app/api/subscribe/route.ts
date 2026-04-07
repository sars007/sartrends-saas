import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      }],
      customer_email: user.email,
      success_url: `${req.headers.get('origin') || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/dashboard?cancelled=true`,
      metadata: {
        userId: user.id
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

