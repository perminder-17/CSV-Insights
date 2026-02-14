export interface CSVFile {
  filename: string
  rows: number
  columns: number
  uploadedAt?: string
}

export interface ColumnProfile {
  missing_percentage: Array<{
    column: string
    percentage: number
  }>
  numeric_outliers: Array<{
    column: string
    outliers: number
  }>
}

export interface Followup {
  question: string
  answer: string
  timestamp: string
}

export interface Report {
  id: string
  filename: string
  rows: number
  columns: number
  createdAt: string
  summary?: string
}

export interface ReportDetail extends Report {
  insights: string
  columnProfile: ColumnProfile
  followups: Followup[]
}

export interface HealthStatus {
  backend: string
  database: string
  llm: string
}
