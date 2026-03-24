'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FlaskIcon } from '@/components/Icons'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0c10]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-indigo-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#0a0c10]">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none" />

      {/* Left - branding */}
      <div className="relative hidden lg:flex lg:w-[520px] lg:flex-col lg:justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/25">
            <FlaskIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Research Hub</span>
        </div>

        <div className="animate-slide-up">
          <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
            Gestiona tu<br />investigacion<br />cientifica.
          </h2>
          <p className="mt-4 text-base text-zinc-400 max-w-sm leading-relaxed">
            Organiza proyectos, datasets, notas y publicaciones en una sola plataforma disenada para investigadores.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Proyectos', 'Datasets', 'Notas', 'Publicaciones'].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/[0.06] border border-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-600">v0.1.0 — Desarrollo local</p>
      </div>

      {/* Right - form */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        <div className="animate-scale-in w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#13151b] p-8 shadow-2xl shadow-black/20">
          {children}
        </div>
      </div>
    </div>
  )
}
