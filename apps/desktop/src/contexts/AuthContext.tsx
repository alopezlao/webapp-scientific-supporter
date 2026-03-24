'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getClient } from '@research-hub/api-client'
import type { AuthUser } from '@research-hub/api-client'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function setAuthCookie(active: boolean) {
  if (typeof document === 'undefined') return
  if (active) {
    document.cookie = 'sb_auth=1; path=/; SameSite=Lax'
  } else {
    document.cookie = 'sb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = getClient()

    // Initial state
    if (client.isAuthenticated()) {
      const currentUser = client.getCurrentUser() as AuthUser | null
      setUser(currentUser)
      setAuthCookie(true)
    } else {
      setAuthCookie(false)
    }
    setIsLoading(false)

    // Subscribe to changes
    const unsubscribe = client.onAuthChange((token, record) => {
      if (token && record) {
        setUser(record)
        setAuthCookie(true)
      } else {
        setUser(null)
        setAuthCookie(false)
      }
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const client = getClient()
      await client.login(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesion'
      setError(message)
      throw err
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setError(null)
    try {
      const client = getClient()
      await client.signup(email, password, name ? { name } : undefined)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cuenta'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    const client = getClient()
    client.logout()
    setUser(null)
    setAuthCookie(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
