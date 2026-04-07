import { cookies } from 'next/headers'
import { auth, type AuthUser } from './auth'

export const getServerSession = async (): Promise<AuthUser | null> => {
  const cookieStore = cookies()
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return null
  }

  const session = await auth.validateSession(sessionId)
  if (!session) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { session: true }
  })

  if (!user) {
    return null
  }

  return { ...user, session: session as any }
}

