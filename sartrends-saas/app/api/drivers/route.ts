import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { Driver } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location')
    const truckType = searchParams.get('truckType')
    const availability = searchParams.get('availability')

    const drivers = await prisma.driver.findMany({
      where: {
        ...(location && { location: { contains: location } }),
        ...(truckType && { truckType: { contains: truckType } }),
        ...(availability && { availability: availability === 'true' }),
      },
      include: { user: { select: { name: true, email: true } } },
    })
    return NextResponse.json(drivers)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

