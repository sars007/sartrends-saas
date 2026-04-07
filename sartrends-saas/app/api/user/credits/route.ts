import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const credits = await getUserCredits(user.id)
    return NextResponse.json({ credits })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
  }
}

