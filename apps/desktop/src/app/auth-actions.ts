'use server'

import { cookies } from 'next/headers'
import { createSessionCookieValue, type SessionUser } from '@/lib/auth-session'

const COOKIE_NAME = 'rh_session'

export async function setAuthSession(user: SessionUser): Promise<void> {
  const sessionValue = await createSessionCookieValue(user)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

