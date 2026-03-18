import PocketBase from 'pocketbase'

export interface PBConfig {
  url: string
}

export class PocketBaseClient {
  private pb: PocketBase

  constructor(config: PBConfig) {
    this.pb = new PocketBase(config.url)
  }

  // Auth methods
  async signup(email: string, password: string, data?: Record<string, any>) {
    const record = await this.pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      ...data,
    })
    await this.pb.collection('users').authWithPassword(email, password)
    return record
  }

  async login(email: string, password: string) {
    return await this.pb.collection('users').authWithPassword(email, password)
  }

  async logout() {
    this.pb.authStore.clear()
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid
  }

  getCurrentUser() {
    return this.pb.authStore.record
  }

  getAuthToken() {
    return this.pb.authStore.token
  }

  // Collection methods
  collection(name: string) {
    return this.pb.collection(name)
  }

  // General CRUD
  async getRecord(collection: string, id: string) {
    return await this.pb.collection(collection).getOne(id)
  }

  async getList(collection: string, page = 1, perPage = 50, filter = '') {
    return await this.pb.collection(collection).getList(page, perPage, { filter })
  }

  async createRecord(collection: string, data: Record<string, any>) {
    return await this.pb.collection(collection).create(data)
  }

  async updateRecord(collection: string, id: string, data: Record<string, any>) {
    return await this.pb.collection(collection).update(id, data)
  }

  async deleteRecord(collection: string, id: string) {
    return await this.pb.collection(collection).delete(id)
  }

  // Subscriptions
  subscribe(collection: string, callback: (data: any) => void) {
    return this.pb.collection(collection).subscribe('*', callback)
  }

  unsubscribe(collection: string) {
    return this.pb.collection(collection).unsubscribe('*')
  }

  // File upload
  async uploadFile(
    collection: string,
    recordId: string,
    field: string,
    file: File
  ) {
    const formData = new FormData()
    formData.append(field, file)

    return await this.pb.collection(collection).update(recordId, formData)
  }

  // Health check
  async health() {
    try {
      const response = await fetch(`${this.pb.baseUrl}/api/health`)
      return response.ok
    } catch {
      return false
    }
  }

  // Get raw instance for advanced usage
  getInstance() {
    return this.pb
  }
}

// Factory function
export function createPocketBaseClient(url: string) {
  return new PocketBaseClient({ url })
}
