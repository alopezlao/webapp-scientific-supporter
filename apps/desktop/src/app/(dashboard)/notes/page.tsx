'use client'

import { useEffect, useState } from 'react'
import { getNotes } from '@/lib/local-data-client'
import { DataTable } from '@/components/DataTable'
import { PageShell } from '@/components/PageShell'
import { FileTextIcon } from '@/components/Icons'

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageShell
      title="Notas"
      description="Observaciones y analisis de laboratorio"
      count={notes.length}
      loading={loading}
      error={error}
      icon={<FileTextIcon className="h-4 w-4" />}
    >
      <DataTable
        icon={<FileTextIcon className="h-3.5 w-3.5" />}
        title="Notas de Laboratorio"
        columns={[
          {
            key: 'title',
            label: 'Titulo',
            render: (title: string) => <span className="font-medium text-zinc-800">{title}</span>,
          },
          {
            key: 'content',
            label: 'Contenido',
            render: (content: string | null) => content
              ? <span className="line-clamp-1 max-w-[320px] text-zinc-500">{content}</span>
              : <span className="text-zinc-300">--</span>,
          },
          {
            key: 'tags',
            label: 'Etiquetas',
            render: (tags: string[] | string | null) => {
              if (!tags) return <span className="text-zinc-300">--</span>
              try {
                const arr = typeof tags === 'string' ? JSON.parse(tags) : tags
                return (
                  <div className="flex flex-wrap gap-1">
                    {arr.map((tag: string) => (
                      <span key={tag} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              } catch {
                return <span className="text-zinc-500">{String(tags)}</span>
              }
            },
          },
        ]}
        data={notes}
      />
    </PageShell>
  )
}
