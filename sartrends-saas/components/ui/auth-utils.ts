// Client side session - improved with cookie check
export async function getClientSession() {
  if (typeof document !== 'undefined') {
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_session='))
    if (sessionCookie) {
      // Validate session server-side preferred, but basic check
      return { user: { id: 'valid' } as any }
    }
  }
  return { user: { id: localStorage.getItem('userId') || '' } as any };
}

