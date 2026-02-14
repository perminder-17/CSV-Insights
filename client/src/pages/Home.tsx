import React, { useState } from 'react'
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { api, CSVFile } from '../lib/api'
import DataTablePreview from '../components/DataTablePreview'

interface UploadState {
  isLoading: boolean
  error: string | null
  file: File | null
  preview: CSVFile | null
}

export default function Home() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isLoading: false,
    error: null,
    file: null,
    preview: null,
  })
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) {
      setUploadState({ ...uploadState, error: 'No file selected' })
      return
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadState({ ...uploadState, error: 'Please select a CSV file' })
      return
    }

    setUploadState({ ...uploadState, isLoading: true, error: null, file })

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length === 0) {
        setUploadState({
          isLoading: false,
          error: 'CSV file is empty',
          file: null,
          preview: null,
        })
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const sampleRows = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim())
        return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']))
      })

      setUploadState({
        isLoading: false,
        error: null,
        file,
        preview: {
          filename: file.name,
          rowCount: lines.length - 1,
          columnCount: headers.length,
          columns: headers,
          sampleRows,
        },
      })
    } catch (err) {
      setUploadState({
        isLoading: false,
        error: 'Failed to parse CSV file',
        file: null,
        preview: null,
      })
    }
  }

  const handleUpload = async () => {
    if (!uploadState.file) return;

    setUploadState({ ...uploadState, isLoading: true, error: null });

    try {
      const created = await api.uploadCSV(uploadState.file);
      // go directly to detail page of the created report
      window.location.href = `/reports/${created.id}`;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Upload failed';
      setUploadState({
        ...uploadState,
        isLoading: false,
        error: errorMessage,
      });
    }
  };


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-white">CSV Insights Dashboard</h1>
        <p className="text-slate-400">Upload your CSV file to get AI-powered insights and analysis</p>
      </div>

      {uploadState.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <p className="text-red-200">{uploadState.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-12 text-center cursor-pointer transition-colors bg-slate-900/50 hover:bg-slate-900/70"
        >
          <Upload className="mx-auto mb-4 text-slate-400" size={40} />
          <p className="text-lg font-medium text-slate-200 mb-2">Drop your CSV here</p>
          <p className="text-slate-400 text-sm">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>

        {uploadState.preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <div className="text-left flex-1">
                <p className="font-medium text-green-400">{uploadState.preview.filename}</p>
                <p className="text-sm text-slate-400">
                  {uploadState.preview.rowCount} rows • {uploadState.preview.columnCount} columns
                </p>
              </div>
            </div>

            <DataTablePreview data={uploadState.preview.sampleRows || []} columns={uploadState.preview.columns} />

            <button
              onClick={handleUpload}
              disabled={uploadState.isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {uploadState.isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                'Analyze CSV'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
