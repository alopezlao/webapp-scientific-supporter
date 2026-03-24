'use client'

import { useEffect, useState } from 'react'
import { getDatasets } from '@/lib/supabase-client'
import { DataTable } from '@/components/DataTable'
import { PageShell } from '@/components/PageShell'
import { DatabaseIcon, ExternalLinkIcon } from '@/components/Icons'

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDatasets()
      .then(setDatasets)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageShell
      title="Datasets"
      description="Datos cientificos"
      count={datasets.length}
      loading={loading}
      error={error}
      icon={<DatabaseIcon className="h-4 w-4" />}
    >
      <DataTable
        icon={<DatabaseIcon className="h-3.5 w-3.5" />}
        title="Datos Cientificos"
        columns={[
          {
            key: 'name',
            label: 'Nombre',
            render: (name) => <span className="font-medium text-zinc-800">{name}</span>,
          },
          {
            key: 'description',
            label: 'Descripcion',
            render: (desc) => desc
              ? <span className="line-clamp-1 max-w-[240px] text-zinc-500">{desc}</span>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'data_type',
            label: 'Tipo',
            width: '80px',
            render: (type) => {
              const colors: Record<string, string> = {
                csv: 'bg-blue-500/10 text-blue-600',
                json: 'bg-amber-500/10 text-amber-600',
                raw_data: 'bg-purple-500/10 text-purple-600',
                image: 'bg-pink-500/10 text-pink-600',
              }
              return (
                <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-mono font-medium uppercase ${colors[type] || 'bg-zinc-100 text-zinc-500'}`}>
                  {type || '--'}
                </span>
              )
            },
          },
          {
            key: 'file_size',
            label: 'Tamano',
            width: '80px',
            render: (size) => {
              if (!size) return <span className="text-zinc-300">--</span>
              const formatted = size >= 1048576 ? `${(size / 1048576).toFixed(1)} MB` : `${(size / 1024).toFixed(1)} KB`
              return <span className="font-mono text-[12px] tabular-nums text-zinc-500">{formatted}</span>
            },
          },
          {
            key: 'file_url',
            label: '',
            width: '60px',
            render: (url) => url
              ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-indigo-500 hover:text-indigo-400"><ExternalLinkIcon className="h-3 w-3" />Abrir</a>
              : <span className="text-zinc-300">--</span>,
          },
        ]}
        data={datasets}
      />
    </PageShell>
  )
}
