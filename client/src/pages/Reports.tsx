import { useEffect, useState } from 'react'
import { AlertCircle, Loader } from 'lucide-react'
import { api, Report } from '../lib/api'
import ReportCard from '../components/ReportCard'

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await api.getReports(5)
        setReports(data)
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch reports'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={32} />
          <p className="text-slate-400">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">Reports</h1>
        <p className="text-slate-400">View your latest CSV analysis reports</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-12 text-center">
          <p className="text-slate-400 text-lg">No reports yet</p>
          <p className="text-slate-500 text-sm mt-2">Upload a CSV file to create your first report</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
