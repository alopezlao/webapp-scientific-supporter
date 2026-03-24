export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

type AuthChangeCallback = (token: string, user: AuthUser | null) => void

interface DesktopApi {
  signup(payload: { email: string; password: string; name?: string }): Promise<AuthUser>
  login(payload: { email: string; password: string }): Promise<AuthUser>
  googleLogin(): Promise<AuthUser>
  list(payload: { collection: string; page?: number; perPage?: number }): Promise<{ items: unknown[]; total: number }>
  get(payload: { collection: string; id: string }): Promise<unknown>
  create(payload: { collection: string; data: Record<string, unknown> }): Promise<unknown>
  update(payload: { collection: string; id: string; data: Record<string, unknown> }): Promise<unknown>
  remove(payload: { collection: string; id: string }): Promise<unknown>
}

function getDesktopApi(): DesktopApi {
  const api = (globalThis as { electron?: { api?: DesktopApi } }).electron?.api
  if (!api) {
    throw new Error('Electron API no disponible. Ejecuta la app en modo desktop.')
  }
  return api
}

export class LocalClient {
  private currentUser: AuthUser | null = null
  private authToken: string | null = null
  private listeners = new Set<AuthChangeCallback>()

  async signup(email: string, password: string, data?: Record<string, unknown>) {
    const user = await getDesktopApi().signup({
      email,
      password,
      name: typeof data?.name === 'string' ? data.name : undefined,
    })
    this.currentUser = user
    this.authToken = user.id
    this.emitAuth()
    return { user }
  }

  async login(email: string, password: string) {
    const user = await getDesktopApi().login({ email, password })
    this.currentUser = user
    this.authToken = user.id
    this.emitAuth()
    return { user }
  }

  async loginWithGoogle() {
    const user = await getDesktopApi().googleLogin()
    this.currentUser = user
    this.authToken = user.id
    this.emitAuth()
    return { user }
  }

  async logout() {
    this.currentUser = null
    this.authToken = null
    this.emitAuth()
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

  onAuthChange(callback: AuthChangeCallback): () => void {
    this.listeners.add(callback)
    callback(this.authToken ?? '', this.currentUser)
    return () => {
      this.listeners.delete(callback)
    }
  }

  async getRecord(collection: string, id: string) {
    return getDesktopApi().get({ collection, id })
  }

  async getList(collection: string, page = 1, perPage = 50) {
    return getDesktopApi().list({ collection, page, perPage })
  }

  async createRecord(collection: string, data: Record<string, unknown>) {
    return getDesktopApi().create({ collection, data })
  }

  async updateRecord(collection: string, id: string, data: Record<string, unknown>) {
    return getDesktopApi().update({ collection, id, data })
  }

  async deleteRecord(collection: string, id: string) {
    return getDesktopApi().remove({ collection, id })
  }

  subscribe(_collection: string, _callback: (data: unknown) => void) {
    return { unsubscribe: () => {} }
  }

  unsubscribe(_collection: string) {
    return
  }

  async uploadFile(_: string, __: string, ___: string, _file: File) {
    throw new Error('uploadFile no soportado en backend local')
  }

  async health() {
    return true
  }

  private emitAuth() {
    const token = this.authToken ?? ''
    for (const listener of this.listeners) {
      listener(token, this.currentUser)
    }
  }
}

export function createLocalClient() {
  return new LocalClient()
}

