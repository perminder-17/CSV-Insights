import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AlertCircle, Loader, Copy, Download, ArrowLeft, Check } from 'lucide-react'
import { api, ReportDetail as ReportDetailType } from '../lib/api'
import FollowupPanel from '../components/FollowupPanel'
import ReactMarkdown from 'react-markdown'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()
  const [report, setReport] = useState<ReportDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await api.getReportDetail(id)
        setReport(data)
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch report'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [id])

  const handleCopy = async () => {
    if (!report?.insights) return
    try {
      await navigator.clipboard.writeText(report.insights)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    if (!report?.insights) return
    const element = document.createElement('a')
    const file = new Blob([report.insights], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${report.filename}-insights.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={32} />
          <p className="text-slate-400">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="space-y-6">
        <Link to="/reports" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft size={18} />
          Back to Reports
        </Link>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 flex gap-3 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <p className="text-red-200">{error || 'Report not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link to="/reports" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors w-fit">
        <ArrowLeft size={18} />
        Back to Reports
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">{report.filename}</h1>
        <div className="flex gap-4 text-slate-400 text-sm">
          <span>{report.rowCount} rows</span>
          <span>•</span>
          <span>{report.columnCount} columns</span>
          <span>•</span>
          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Insights</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-slate-200"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-slate-200"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-strong:text-white prose-strong:font-bold">
              <ReactMarkdown>
                {report.insights}
              </ReactMarkdown>
            </div>
          </div>

          {report.sampleRows && report.sampleRows.length > 0 && (
            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Data Sample</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead className="border-b border-slate-700 text-slate-200 font-medium">
                    <tr>
                      {Object.keys(report.sampleRows[0] || {}).map(col => (
                        <th key={col} className="text-left py-3 px-4 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.sampleRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        {Object.values(row).map((val, colIdx) => (
                          <td key={colIdx} className="py-3 px-4 truncate">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <FollowupPanel reportId={report.id} />
        </div>
      </div>
    </div>
  )
}
