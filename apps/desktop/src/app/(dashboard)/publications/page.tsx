'use client'

import { useEffect, useState } from 'react'
import { getPublications } from '@/lib/local-data-client'
import { DataTable } from '@/components/DataTable'
import { PageShell } from '@/components/PageShell'
import { BookOpenIcon, ExternalLinkIcon } from '@/components/Icons'

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublications()
      .then(setPublications)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageShell
      title="Publicaciones"
      description="Articulos y trabajos publicados"
      count={publications.length}
      loading={loading}
      error={error}
      icon={<BookOpenIcon className="h-4 w-4" />}
    >
      <DataTable
        icon={<BookOpenIcon className="h-3.5 w-3.5" />}
        title="Articulos Publicados"
        columns={[
          {
            key: 'title',
            label: 'Titulo',
            render: (title: string) => <span className="font-medium text-zinc-800">{title}</span>,
          },
          { key: 'journal', label: 'Revista' },
          {
            key: 'doi',
            label: 'DOI',
            render: (doi: string | null) => doi
              ? <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">{doi}</code>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'published_date',
            label: 'Fecha',
            width: '110px',
            render: (date: string | null) => date
              ? <span className="tabular-nums text-zinc-500">{new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'url',
            label: '',
            width: '60px',
            render: (url: string | null) => url
              ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-indigo-500 hover:text-indigo-400"><ExternalLinkIcon className="h-3 w-3" />Leer</a>
              : <span className="text-zinc-300">--</span>,
          },
        ]}
        data={publications}
      />
    </PageShell>
  )
}
