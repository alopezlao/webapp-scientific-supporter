import { createClient as createSupabaseClient, SupabaseClient as SBClient } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export class SupabaseClient {
  private supabase: SBClient
  private callbackUnsubscribe: (() => void) | null = null
  private currentUser: AuthUser | null = null
  private authToken: string | null = null

  constructor(config: SupabaseConfig) {
    this.supabase = createSupabaseClient(config.url, config.anonKey)

    // Inicializa el estado de sesión local
    this.supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (session?.user) {
        this.authToken = session.access_token
        this.currentUser = {
          id: session.user.id,
          email: session.user.email ?? '',
          name: (session.user.user_metadata as any)?.name,
          avatar: (session.user.user_metadata as any)?.avatar,
          created_at: (session.user as any).created_at,
          updated_at: (session.user as any).updated_at,
        }
      }
    })
  }

  async signup(email: string, password: string, data?: Record<string, any>) {
    const { data: signUpData, error } = await this.supabase.auth.signUp({ email, password, options: { data } })
    if (error) throw error

    if (signUpData.session?.user) {
      this.authToken = signUpData.session.access_token
      this.currentUser = {
        id: signUpData.session.user.id,
        email: signUpData.session.user.email ?? '',
        name: (signUpData.session.user.user_metadata as any)?.name,
        avatar: (signUpData.session.user.user_metadata as any)?.avatar,
      }
    }

    return signUpData
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    if (data.session?.user) {
      this.authToken = data.session.access_token
      this.currentUser = {
        id: data.session.user.id,
        email: data.session.user.email ?? '',
        name: (data.session.user.user_metadata as any)?.name,
        avatar: (data.session.user.user_metadata as any)?.avatar,
      }
    }

    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
    this.authToken = null
    this.currentUser = null
  }

  isAuthenticated(): boolean {
    return !!this.currentUser
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  getAuthToken(): string | null {
    return this.authToken
  }

  onAuthChange(callback: (token: string, user: AuthUser | null) => void): () => void {
    const { data: listener } = this.supabase.auth.onAuthStateChange((event, session) => {
      const token = session?.access_token ?? ''
      const user = session?.user
        ? {
            id: session.user.id,
            email: session.user.email || '',
            name: (session.user.user_metadata as any)?.name,
            avatar: (session.user.user_metadata as any)?.avatar,
          }
        : null

      this.authToken = token || null
      this.currentUser = user

      callback(token, user)
    })

    this.callbackUnsubscribe = () => {
      listener.subscription.unsubscribe()
    }

    return this.callbackUnsubscribe
  }

  async getRecord(collection: string, id: string) {
    const { data, error } = await this.supabase.from(collection).select('*').eq('id', id).single()
    if (error) throw error
    return data
  }

  async getList(collection: string, page = 1, perPage = 50) {
    const from = (page - 1) * perPage
    const to = page * perPage - 1
    const { data, error, count } = await this.supabase
      .from(collection)
      .select('*', { count: 'exact' })
      .range(from, to)

    if (error) throw error
    return {
      items: data ?? [],
      total: count ?? (data?.length ?? 0),
    }
  }

  async createRecord(collection: string, data: Record<string, any>) {
    const { data: created, error } = await this.supabase.from(collection).insert(data).single()
    if (error) throw error
    return created
  }

  async updateRecord(collection: string, id: string, data: Record<string, any>) {
    const { data: updated, error } = await this.supabase.from(collection).update(data).eq('id', id).single()
    if (error) throw error
    return updated
  }

  async deleteRecord(collection: string, id: string) {
    const { data: deleted, error } = await this.supabase.from(collection).delete().eq('id', id).single()
    if (error) throw error
    return deleted
  }

  // Subscriptions stub (no-op)
  subscribe(collection: string, callback: (data: any) => void) {
    // TODO: Implement Realtime subscriptions if required
    return { unsubscribe: () => {} }
  }

  unsubscribe(collection: string) {
    // no-op
    return
  }

  async uploadFile(_: string, __: string, ___: string, file: File) {
    throw new Error('uploadFile no soportado en SupabaseClient, usar storage nativo')
  }

  async health() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/health`) // Supabase health check deberá configurarse
      return response.ok
    } catch {
      return false
    }
  }

  getInstance() {
    return this.supabase
  }
}

export function createSupabaseClientWrapper(url: string, anonKey: string) {
  return new SupabaseClient({ url, anonKey })
}
