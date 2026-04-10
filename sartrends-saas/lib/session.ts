import { randomUUID } from 'crypto'
import { prisma } from './db'
import type { Session } from '@prisma/client'
import { getUserFromCookie } from './auth'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'

export interface CreateSessionInput {
  userId: string
  ip?: string
}

export async function createSession(input: CreateSessionInput): Promise<Session> {
  const deviceId = randomUUID()
  const ip = input.ip || headers().get('x-forwarded-for') || 'unknown'

  // Get allowed sessions from subscription or default 1
  const userWithSub = await prisma.user.findUnique({
    where: { id: input.userId },
    include: { subscription: true },
  })
  if (!userWithSub) throw new Error('User not found')

  const allowed = userWithSub.subscription?.status === 'active' && userWithSub.subscription.plan === 'agency' 
    ? -1 
    : userWithSub.subscription?.allowedSessions ?? 1

  const activeCount = await getActiveSessionsCount(input.userId)

  if (allowed > 0 && activeCount >= allowed) {
    // Delete oldest session
    const oldestSessions = await prisma.session.findMany({
      where: { userId: input.userId },
      orderBy: { createdAt: 'asc' },
      take: 1,
    })
    if (oldestSessions[0]) {
      await prisma.session.delete({ where: { id: oldestSessions[0].id } })
    }
  }

  const session = await prisma.session.create({
    data: {
      userId: input.userId,
      deviceId,
      ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  return session
}

export async function getActiveSessionsCount(userId: string): Promise<number> {
  const count = await prisma.session.count({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  })
  return count
}

export async function validateSession(token: string, sessionId: string, deviceId: string, ip: string): Promise<boolean> {
  const decoded = getUserFromCookie() // from token cookie
  if (!decoded || decoded.sub !== sessionId.split('-')[0]) return false // rough

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })
  if (!session || session.expiresAt! < new Date() || session.deviceId !== deviceId || session.ip !== ip) {
    await prisma.session.deleteMany({ where: { id: sessionId } }) // cleanup invalid
    return false
  }
  return true
}

export async function logout(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } })
}

export async function getCurrentSession() {
  const userPayload = getUserFromCookie()
  if (!userPayload) return null
  const ip = headers().get('x-forwarded-for') || 'unknown'
  const deviceId = randomUUID() // client should send, for server demo
  // In real, store deviceId in localStorage, send in header
  return { userId: userPayload.sub, deviceId, ip }
}
