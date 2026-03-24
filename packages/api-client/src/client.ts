import { LocalClient, createLocalClient } from './local'

export function createClient(): LocalClient {
  return createLocalClient()
}

let client: LocalClient | null = null

export function getClient(): LocalClient {
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
