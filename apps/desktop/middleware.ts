import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionCookieValue } from '@/lib/auth-session'

const PUBLIC_PATHS = ['/login', '/signup']
const SESSION_COOKIE = 'rh_session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const hasAuth = !!(await verifySessionCookieValue(sessionCookie))

  if (!hasAuth && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (hasAuth && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\.).*)'],
}
