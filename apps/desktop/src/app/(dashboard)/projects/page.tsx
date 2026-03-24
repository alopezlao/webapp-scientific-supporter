'use client'

import { useEffect, useState } from 'react'
import { getProjects } from '@/lib/supabase-client'
import { DataTable } from '@/components/DataTable'
import { PageShell } from '@/components/PageShell'
import { FlaskIcon } from '@/components/Icons'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageShell
      title="Proyectos"
      description="Proyectos de investigacion"
      count={projects.length}
      loading={loading}
      error={error}
      icon={<FlaskIcon className="h-4 w-4" />}
    >
      <DataTable
        icon={<FlaskIcon className="h-3.5 w-3.5" />}
        title="Proyectos de Investigacion"
        columns={[
          {
            key: 'title',
            label: 'Titulo',
            render: (title) => <span className="font-medium text-zinc-800">{title}</span>,
          },
          {
            key: 'description',
            label: 'Descripcion',
            render: (desc) => desc
              ? <span className="line-clamp-1 max-w-[280px] text-zinc-500">{desc}</span>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'status',
            label: 'Estado',
            width: '100px',
            render: (status) => {
              const cfg: Record<string, { bg: string; text: string; label: string }> = {
                active: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'Activo' },
                completed: { bg: 'bg-sky-500/10', text: 'text-sky-600', label: 'Completado' },
                archived: { bg: 'bg-zinc-500/10', text: 'text-zinc-500', label: 'Archivado' },
              }
              const c = cfg[status] || { bg: 'bg-zinc-100', text: 'text-zinc-500', label: status || '--' }
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${c.bg} ${c.text}`}>
                  <span className={`h-1 w-1 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                  {c.label}
                </span>
              )
            },
          },
          {
            key: 'start_date',
            label: 'Inicio',
            width: '110px',
            render: (date) => date
              ? <span className="tabular-nums text-zinc-500">{new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'end_date',
            label: 'Fin',
            width: '110px',
            render: (date) => date
              ? <span className="tabular-nums text-zinc-500">{new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              : <span className="text-zinc-300">--</span>,
          },
        ]}
        data={projects}
      />
    </PageShell>
  )
}
