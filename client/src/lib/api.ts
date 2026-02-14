import axios, { AxiosError, AxiosResponse } from 'axios'

const apiClient = axios.create()

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export interface CSVFile {
  filename: string
  rowCount: number
  columnCount: number
  columns: string[]
  sampleRows?: Record<string, string>[]
}

export interface Report {
  id: string
  filename: string
  rowCount: number
  columnCount: number
  createdAt: string
  updatedAt?: string
}

export interface ReportDetail extends Report {
  insights: string
  sampleRows?: Record<string, string>[]
  followups?: Followup[]
}

export interface HealthStatus {
  backend: 'ok' | 'error'
  database: 'ok' | 'error'
  llm: 'ok' | 'error'
}

export interface Followup {
  id?: string
  question: string
  answer: string
  createdAt: string
}

// ---- mappers (backend -> UI types) ----
function mapReport(r: any): Report {
  return {
    id: r?.id ?? r?._id ?? '',
    filename: r?.filename ?? r?.fileName ?? '',
    rowCount: r?.rowCount ?? 0,
    columnCount: r?.columnCount ?? 0,
    createdAt: r?.createdAt ?? new Date().toISOString(),
    updatedAt: r?.updatedAt,
  }
}

function mapReportDetail(r: any): ReportDetail {
  return {
    ...mapReport(r),
    insights: r?.insights ?? r?.insightsMd ?? '',
    sampleRows: r?.sampleRows ?? [],
    followups: Array.isArray(r?.followups)
      ? r.followups.map((f: any) => ({
          id: f?._id ?? f?.id,
          question: f?.question ?? '',
          answer: f?.answer ?? '',
          createdAt: f?.createdAt ?? new Date().toISOString(),
        }))
      : [],
  }
}

function okErr(node: any): 'ok' | 'error' {
  return node?.ok ? 'ok' : 'error'
}

// ---- API ----
export const api = {
  uploadCSV: async (file: File): Promise<Report> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/api/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    // backend might return {report: {...}} or just {...}
    const raw = (response.data as any)?.report ?? response.data
    return mapReport(raw)
  },

  getReports: async (limit: number = 5): Promise<Report[]> => {
    const response = await apiClient.get('/api/reports', { params: { limit } })
    const rawList = (response.data as any)?.reports ?? response.data ?? []
    return Array.isArray(rawList) ? rawList.map(mapReport) : []
  },

  getReportDetail: async (id: string): Promise<ReportDetail> => {
    const response = await apiClient.get(`/api/reports/${id}`)
    const raw = (response.data as any)?.report ?? response.data
    return mapReportDetail(raw)
  },

  addFollowup: async (reportId: string, question: string): Promise<Followup> => {
    const response = await apiClient.post(`/api/reports/${reportId}/followups`, {
      question,
    })

    // backend might return {followup: {...}} or {report: {...}} or {...}
    const data: any = response.data
    const followup =
      data?.followup ??
      data?.answer ??
      (data?.report?.followups?.[0] ?? null) ??
      null

    if (followup) {
      return {
        id: followup?._id ?? followup?.id,
        question: followup?.question ?? question,
        answer: followup?.answer ?? String(followup),
        createdAt: followup?.createdAt ?? new Date().toISOString(),
      }
    }

    // fallback
    return {
      question,
      answer: typeof data === 'string' ? data : JSON.stringify(data),
      createdAt: new Date().toISOString(),
    }
  },

  getHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get('/api/health')
    const raw: any = response.data

    // your backend format: { backend:{ok:true}, db:{ok:true}, llm:{ok:true} }
    return {
      backend: okErr(raw?.backend),
      database: okErr(raw?.db),
      llm: okErr(raw?.llm),
    }
  },
}

export default apiClient
