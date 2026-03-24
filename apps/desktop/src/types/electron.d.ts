export {}

interface DesktopAuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface DesktopApi {
  signup(payload: { email: string; password: string; name?: string }): Promise<DesktopAuthUser>
  login(payload: { email: string; password: string }): Promise<DesktopAuthUser>
  googleLogin(): Promise<DesktopAuthUser>
  list(payload: { collection: string; page?: number; perPage?: number }): Promise<{ items: unknown[]; total: number }>
  get(payload: { collection: string; id: string }): Promise<unknown>
  create(payload: { collection: string; data: Record<string, unknown> }): Promise<unknown>
  update(payload: { collection: string; id: string; data: Record<string, unknown> }): Promise<unknown>
  remove(payload: { collection: string; id: string }): Promise<unknown>
  driveListFiles(payload?: { pageSize?: number }): Promise<unknown[]>
  driveReadFileText(payload: { fileId: string }): Promise<string>
  driveWriteFileText(payload: {
    fileId?: string
    name?: string
    parentId?: string
    mimeType?: string
    content: string
  }): Promise<unknown>
}

declare global {
  interface Window {
    electron?: {
      api: DesktopApi
    }
  }
}

