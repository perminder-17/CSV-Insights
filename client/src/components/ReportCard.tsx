import { Link } from 'react-router-dom'
import { ArrowRight, Grid3x3, Rows } from 'lucide-react'
import { Report } from '../lib/api'

interface ReportCardProps {
  report: Report
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      to={`/reports/${report.id}`}
      className="bg-slate-900/50 rounded-lg border border-slate-800 hover:border-blue-500 transition-colors p-6 flex flex-col gap-4 group hover:bg-slate-900/70"
    >
      <div>
        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">{report.filename}</h3>
        <p className="text-sm text-slate-400 mt-1">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Rows size={16} className="text-slate-500" />
          <span>{report.rowCount} rows</span>
        </div>
        <div className="flex items-center gap-2">
          <Grid3x3 size={16} className="text-slate-500" />
          <span>{report.columnCount} cols</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
        <span className="text-sm text-slate-400">View Report</span>
        <ArrowRight size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
      </div>
    </Link>
  )
}
