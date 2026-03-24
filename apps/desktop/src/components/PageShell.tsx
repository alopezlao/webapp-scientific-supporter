'use client'

import { AlertCircleIcon } from './Icons'

interface PageShellProps {
  title: string
  description?: string
  children: React.ReactNode
  count?: number
  loading?: boolean
  error?: string | null
  icon?: React.ReactNode
  actions?: React.ReactNode
}

export function PageShell({ title, description, children, count, loading, error, icon, actions }: PageShellProps) {
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
          <p className="text-sm text-slate-400 animate-pulse">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-scale-in flex items-start gap-3.5 rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
            <AlertCircleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">Error al cargar datos</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
              {count !== undefined && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-indigo-600">
                  {count}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-0.5 text-sm text-slate-400">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {children}
    </div>
  )
}
