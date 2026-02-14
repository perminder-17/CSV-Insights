interface DataTablePreviewProps {
  columns: string[]
  data: Record<string, string>[]
}

export default function DataTablePreview({ columns, data }: DataTablePreviewProps) {
  if (data.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead className="bg-slate-800/50 border-b border-slate-700 text-slate-200 font-medium sticky top-0">
            <tr>
              {columns.map(col => (
                <th key={col} className="text-left py-3 px-4 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                {columns.map(col => (
                  <td key={`${idx}-${col}`} className="py-3 px-4 truncate max-w-xs">
                    {row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
