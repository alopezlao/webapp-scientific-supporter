'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { login, loginWithGoogle, error } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      router.replace('/')
    } catch {
      // error set in context
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      router.replace('/')
    } catch {
      // error set in context
    } finally {
      setGoogleLoading(false)
    }
  }

  const inputClasses =
    'block w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500/25'

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Iniciar sesion</h1>
        <p className="mt-2 text-sm text-zinc-400">Accede a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="animate-scale-in rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Correo electronico
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="Tu contrasena"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Entrando...
            </span>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs text-zinc-500">o</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full rounded-lg border border-white/[0.12] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.06] disabled:opacity-50"
      >
        {googleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
      </button>

      <p className="mt-6 text-center text-sm text-zinc-500">
        No tienes cuenta?{' '}
        <Link href="/signup" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
          Crear cuenta
        </Link>
      </p>
    </>
  )
}
