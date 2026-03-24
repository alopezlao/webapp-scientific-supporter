'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const { signup, error } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError('La contrasena debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setLocalError('Las contrasenas no coinciden')
      return
    }

    setLoading(true)
    try {
      await signup(email, password, name || undefined)
      router.replace('/')
    } catch {
      // error set in context
    } finally {
      setLoading(false)
    }
  }

  const displayError = localError || error

  const inputClasses =
    'block w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500/25'

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
        <p className="mt-2 text-sm text-zinc-400">Unete a Research Hub</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="animate-scale-in rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {displayError}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="Tu nombre"
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="Minimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
            Confirmar contrasena
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClasses}
            placeholder="Repite la contrasena"
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
              Creando cuenta...
            </span>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
          Iniciar sesion
        </Link>
      </p>
    </>
  )
}
