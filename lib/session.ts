import { auth } from './auth'
import type { cookies } from 'next/headers'

export async function getSession(cookies: ReturnType<typeof cookies>) {
  const sessionId = cookies().get(auth.sessionCookieName)?.value
  if (!sessionId) return null

  const session = await auth.getSessionById(sessionId)
  if (!session) {
    cookies().delete(auth.sessionCookieName, {
      path: '/',
    })
    return null
  }

  return session
}

