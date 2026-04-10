import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { Load, TrailerType, LoadStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pickup = searchParams.get('pickup')
    const dropoff = searchParams.get('dropoff')
    const rate = searchParams.get('rate')
    // filters

    const loads = await prisma.load.findMany({
      where: {
        status: 'available',
        ...(pickup && { pickupLocation: { contains: pickup } }),
        // add filters
      },
      include: { broker: { select: { name: true } } },
    })
    return NextResponse.json(loads)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromCookie()
    if (!userPayload || !['broker', 'dispatcher'].includes(userPayload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json() as Omit<Load, 'id' | 'brokerId'> & { brokerId: string }
    const load = await prisma.load.create({
      data: {
        ...data,
        brokerId: userPayload.sub,
      },
    })
    return NextResponse.json(load)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

