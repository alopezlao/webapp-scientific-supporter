'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboardIcon,
  FlaskIcon,
  DatabaseIcon,
  FileTextIcon,
  BookOpenIcon,
  LogOutIcon,
} from './Icons'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
  { name: 'Proyectos', href: '/projects', icon: FlaskIcon },
  { name: 'Datasets', href: '/datasets', icon: DatabaseIcon },
  { name: 'Notas', href: '/notes', icon: FileTextIcon },
  { name: 'Publicaciones', href: '/publications', icon: BookOpenIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/[0.06] bg-gradient-to-b from-[#0c0e14] to-[#111318]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/25">
          <FlaskIcon className="h-[18px] w-[18px] text-white" />
        </div>
        <div>
          <span className="text-[15px] font-semibold text-white tracking-tight">Research Hub</span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Plataforma cientifica
          </span>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-6 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
          Navegacion
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto dark-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
              )}
              <item.icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-indigo-400'
                    : 'text-zinc-500 group-hover:text-zinc-400'
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status */}
      <div className="mx-3 mb-3 rounded-lg bg-white/[0.04] px-3 py-2.5 border border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-500">SQLite local</span>
          <span className="text-xs font-medium text-emerald-400">Conectado</span>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[11px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-200">
              {user?.name || 'Usuario'}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {user?.email || ''}
            </p>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesion"
            className="rounded-lg p-1.5 text-zinc-500 transition-all duration-200 hover:bg-white/[0.06] hover:text-zinc-300"
          >
            <LogOutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
