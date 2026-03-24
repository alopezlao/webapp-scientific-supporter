import { SupabaseClient, createSupabaseClientWrapper } from './supabase'

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createSupabaseClientWrapper(url, anonKey)
}

let client: SupabaseClient | null = null

export function getClient(): SupabaseClient {
  if (!client) {
    client = createClient()
  }
  return client
}

export function resetClient(): void {
  if (client) {
    client.logout().catch(() => {})
  }
  client = null
}
