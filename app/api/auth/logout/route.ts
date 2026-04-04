import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const sessionCookie = cookies().get(auth.sessionCookieName);
    
    if (sessionCookie) {
      await auth.invalidateSession(sessionCookie.value);
    }

    cookies().delete(auth.sessionCookieName);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
