import { PocketBaseClient, createPocketBaseClient } from './pocketbase'

/**
 * Crea un cliente API adaptado según el ambiente
 *
 * Desarrollo: PocketBase (local)
 * Producción: Supabase (remoto)
 */
export function createClient(): PocketBaseClient {
  const url =
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    process.env.REACT_APP_POCKETBASE_URL ||
    'http://localhost:8090'

  if (process.env.NODE_ENV === 'development') {
    console.log('[API Client] Using PocketBase:', url)
    return createPocketBaseClient(url)
  }

  // En producción, aquí iría Supabase
  // Por ahora, mantenemos PocketBase para facilitar testing
  console.log('[API Client] Using PocketBase (development URL):', url)
  return createPocketBaseClient(url)
}

// Singleton instance
let client: PocketBaseClient | null = null

export function getClient(): PocketBaseClient {
  if (!client) {
    client = createClient()
  }
  return client
}

// Reset client (útil para tests)
export function resetClient(): void {
  if (client) {
    client.logout().catch(() => {})
  }
  client = null
}
