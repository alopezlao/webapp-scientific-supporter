'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getClient } from '@research-hub/api-client'
import type { AuthUser } from '@research-hub/api-client'
import { clearAuthSession, setAuthSession } from '@/app/auth-actions'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

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
      if (currentUser) {
        void setAuthSession({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        })
      }
    } else {
      void clearAuthSession()
    }
    setIsLoading(false)

    // Subscribe to changes
    const unsubscribe = client.onAuthChange((token, record) => {
      if (token && record) {
        setUser(record)
        void setAuthSession({
          id: record.id,
          email: record.email,
          name: record.name,
        })
      } else {
        setUser(null)
        void clearAuthSession()
      }
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const client = getClient()
      await client.login(email, password)
      const currentUser = client.getCurrentUser()
      if (currentUser) {
        await setAuthSession({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        })
      }
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
      const currentUser = client.getCurrentUser()
      if (currentUser) {
        await setAuthSession({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cuenta'
      setError(message)
      throw err
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const client = getClient()
      await client.loginWithGoogle()
      const currentUser = client.getCurrentUser()
      if (currentUser) {
        await setAuthSession({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar con Google'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    const client = getClient()
    await client.logout()
    await clearAuthSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        loginWithGoogle,
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
