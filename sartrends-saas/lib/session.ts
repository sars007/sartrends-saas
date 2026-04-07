import { auth } from './auth'
import type { cookies } from 'next/headers'
import type { Session } from 'lucia'

export async function getSession(cookieStore: ReturnType<typeof cookies>): Promise<Session | null> {
  const sessionId = cookieStore.get(auth.sessionCookieName)?.value
  if (!sessionId) return null

  const result = await auth.validateSession(sessionId)
  switch (result.type) {
    case 'valid':
      return result.session
    default:
      cookieStore.delete(auth.sessionCookieName, { path: '/' })
      return null
  }
}

