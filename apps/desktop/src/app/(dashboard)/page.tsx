'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getClient } from '@research-hub/api-client'
import {
  FlaskIcon,
  DatabaseIcon,
  FileTextIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@/components/Icons'

const sections = [
  {
    name: 'Proyectos',
    description: 'Investigaciones activas',
    href: '/projects',
    icon: FlaskIcon,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    ring: 'ring-indigo-500/20',
    endpoint: 'projects',
  },
  {
    name: 'Datasets',
    description: 'Datos cientificos',
    href: '/datasets',
    icon: DatabaseIcon,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    ring: 'ring-violet-500/20',
    endpoint: 'datasets',
  },
  {
    name: 'Notas',
    description: 'Observaciones de lab',
    href: '/notes',
    icon: FileTextIcon,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-500/20',
    endpoint: 'notes',
  },
  {
    name: 'Publicaciones',
    description: 'Articulos publicados',
    href: '/publications',
    icon: BookOpenIcon,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-500/20',
    endpoint: 'publications',
  },
]

const staggerDelays = ['delay-1', 'delay-2', 'delay-3', 'delay-4']

export default function Home() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<Record<string, number | null>>({})

  useEffect(() => {
    async function loadCounts() {
      const client = getClient()
      const results: Record<string, number | null> = {}
      for (const section of sections) {
        try {
          const result = await client.getList(section.endpoint, 1, 1)
          results[section.endpoint] = result.total
        } catch {
          results[section.endpoint] = null
        }
      }
      setCounts(results)
    }
    loadCounts()
  }, [])

  const greeting = user?.name ? user.name.split(' ')[0] : 'investigador'

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Buenos dias' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Welcome banner */}
      <div className="animate-fade-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10">
          <p className="text-sm font-medium text-indigo-200">{timeGreeting}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Hola, {greeting}
          </h1>
          <p className="mt-2 text-sm text-indigo-200/80 max-w-md leading-relaxed">
            Gestiona tus proyectos de investigacion, datasets y publicaciones desde un solo lugar.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.05]" />
        <div className="absolute -right-8 -bottom-20 h-48 w-48 rounded-full bg-white/[0.03]" />
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, i) => {
          const count = counts[section.endpoint]
          return (
            <Link
              key={section.name}
              href={section.href}
              className={`animate-slide-up ${staggerDelays[i]} group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${section.bg} ring-1 ${section.ring}`}>
                <section.icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold tabular-nums text-slate-900 tracking-tight">
                  {count !== undefined ? (
                    count ?? <span className="text-slate-300">&mdash;</span>
                  ) : (
                    <span className="inline-block h-7 w-12 animate-pulse rounded-lg bg-slate-100" />
                  )}
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-500">{section.name}</p>
              </div>
              <ArrowRightIcon className="absolute right-4 bottom-5 h-4 w-4 text-slate-200 transition-all duration-300 group-hover:text-slate-400 group-hover:translate-x-1" />
            </Link>
          )
        })}
      </div>

      {/* Quick navigation */}
      <div className="mt-6 animate-slide-up delay-5 rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-900">Acceso rapido</h2>
          <p className="text-sm text-slate-400 mt-0.5">Navega entre tus secciones de investigacion</p>
        </div>
        <div className="divide-y divide-slate-100">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/80"
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${section.bg}`}>
                <section.icon className={`h-4 w-4 ${section.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700">{section.name}</p>
                <p className="text-xs text-slate-400">{section.description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-500">
                {counts[section.endpoint] ?? '—'} registros
              </span>
              <ArrowRightIcon className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white/60 px-5 py-3">
        <span className="text-xs font-medium text-slate-400">Stack</span>
        <div className="flex items-center gap-2">
          {['Next.js', 'Supabase', 'Electron', 'Tailwind'].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500"
            >
              {tech}
            </span>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-slate-300">v0.1.0 · Desarrollo</span>
      </div>
    </div>
  )
}
