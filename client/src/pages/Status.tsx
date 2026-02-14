import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../lib/api'

type HealthResponse =
  | {
      backend?: { ok?: boolean }
      db?: { ok?: boolean; state?: number }
      llm?: { ok?: boolean; provider?: string; timestamp?: string; error?: string }
    }
  | {
      backend: 'ok' | 'error'
      database: 'ok' | 'error'
      llm: 'ok' | 'error'
    }
  | any

type Status = 'ok' | 'error'

function toStatus(v: any): Status {
  if (v === 'ok' || v === 'error') return v
  if (typeof v === 'boolean') return v ? 'ok' : 'error'
  if (v && typeof v === 'object' && 'ok' in v) return toStatus(v.ok)
  return 'error'
}

export default function Status() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await api.getHealth()
        setHealth(data)
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to fetch health status'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealth()
  }, [])

  const normalized = useMemo(() => {
    const raw = health ?? {}
    const backendStatus = toStatus((raw as any).backend)
    const dbStatus = toStatus((raw as any).database ?? (raw as any).db)
    const llmStatus = toStatus((raw as any).llm)

    const dbState = (raw as any)?.db?.state
    const llmProvider = (raw as any)?.llm?.provider
    const llmTimestamp = (raw as any)?.llm?.timestamp
    const llmError = (raw as any)?.llm?.error

    return { backendStatus, dbStatus, llmStatus, dbState, llmProvider, llmTimestamp, llmError, raw }
  }, [health])

  const StatusBadge = ({
    status,
    label,
    sub,
  }: {
    status: Status
    label: string
    sub?: string
  }) => (
    <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg border border-slate-800 p-4">
      {status === 'ok' ? (
        <>
          <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
          <div>
            <p className="font-medium text-white">{label}</p>
            <p className="text-sm text-green-400">{sub ?? 'Operational'}</p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <p className="font-medium text-white">{label}</p>
            <p className="text-sm text-red-400">{sub ?? 'Down'}</p>
          </div>
        </>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={32} />
          <p className="text-slate-400">Loading status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">System Status</h1>
        <p className="text-slate-400">Real-time health check of all services</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-red-200">{error}</p>
            <p className="text-sm text-slate-400 mt-1">
              Tip: open <span className="text-slate-200">http://localhost:4000/api/health</span> in browser
              and check server terminal logs.
            </p>
          </div>
        </div>
      )}

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusBadge status={normalized.backendStatus} label="Backend" />
          <StatusBadge
            status={normalized.dbStatus}
            label="Database"
            sub={normalized.dbState != null ? `state: ${normalized.dbState}` : undefined}
          />
          <StatusBadge
            status={normalized.llmStatus}
            label="LLM"
            sub={
              normalized.llmProvider
                ? `${normalized.llmProvider}${normalized.llmTimestamp ? ` • ${new Date(normalized.llmTimestamp).toLocaleString()}` : ''}`
                : normalized.llmError
                ? normalized.llmError
                : undefined
            }
          />
        </div>
      )}

      {health && (
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Response JSON</h2>
          <pre className="bg-slate-950 rounded p-4 overflow-x-auto text-sm text-slate-300 font-mono">
            {JSON.stringify(normalized.raw, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
