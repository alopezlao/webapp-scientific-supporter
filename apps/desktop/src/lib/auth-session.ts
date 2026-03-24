export interface SessionUser {
  id: string
  email: string
  name?: string
}

interface SessionPayload {
  sub: string
  email: string
  name?: string
  exp: number
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
const DEFAULT_DEV_SECRET = 'dev-only-change-me'

function getSessionSecret(): string {
  const configured = process.env.AUTH_SESSION_SECRET
  if (configured && configured.length >= 16) return configured
  if (process.env.NODE_ENV !== 'production') return DEFAULT_DEV_SECRET
  throw new Error('AUTH_SESSION_SECRET must be set in production')
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return padded
}

function encodeBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input)
  return toBase64Url(toBase64(bytes))
}

function decodeBase64Url(input: string): string {
  const bytes = fromBase64(fromBase64Url(input))
  return new TextDecoder().decode(bytes)
}

async function sign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return toBase64Url(toBase64(new Uint8Array(signature)))
}

export async function createSessionCookieValue(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const body = encodeBase64Url(JSON.stringify(payload))
  const signature = await sign(body, getSessionSecret())
  return `${body}.${signature}`
}

export async function verifySessionCookieValue(value: string | undefined): Promise<SessionUser | null> {
  if (!value) return null
  const [body, signature] = value.split('.')
  if (!body || !signature) return null

  const expected = await sign(body, getSessionSecret())
  if (signature !== expected) return null

  try {
    const parsed = JSON.parse(decodeBase64Url(body)) as SessionPayload
    if (!parsed.sub || !parsed.email) return null
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return {
      id: parsed.sub,
      email: parsed.email,
      name: parsed.name,
    }
  } catch {
    return null
  }
}

