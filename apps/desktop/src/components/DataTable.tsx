import { InboxIcon } from './Icons'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => string | React.ReactNode
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  title: string
  icon?: React.ReactNode
}

export function DataTable({ columns, data, title, icon }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <InboxIcon className="h-7 w-7 text-slate-300" />
        </div>
        <p className="mt-4 text-base font-semibold text-slate-500">Sin registros</p>
        <p className="mt-1 text-sm text-slate-400 max-w-xs text-center">
          Los datos de {title.toLowerCase()} apareceran aqui cuando los agregues
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-500">
          {data.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="border-b border-slate-50 transition-colors duration-150 last:border-0 hover:bg-slate-50/80"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-600">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] || <span className="text-slate-300">&mdash;</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-2.5">
        <span className="text-xs text-slate-400">
          {data.length} registro{data.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
