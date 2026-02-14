import { useRef, useState } from 'react'
import { Cloud, File } from 'lucide-react'
import { clsx } from 'clsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { CSVFile } from '../types'

interface UploadCardProps {
  onUpload: (file: CSVFile) => void
  isLoading?: boolean
}

export function UploadCard({ onUpload, isLoading }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    // Parse CSV to get row and column counts
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split('\n').filter(line => line.trim())
      const rows = Math.max(0, lines.length - 1) // Subtract header
      const columns = lines[0]?.split(',').length || 0

      onUpload({
        filename: file.name,
        rows,
        columns,
      })
    }
    reader.readAsText(file)
  }

  return (
    <Card className="border-2 border-dashed border-border">
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>Drag and drop your CSV file or click to browse</CardDescription>
      </CardHeader>

      <CardContent>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={clsx(
            'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Drop your CSV file here</p>
          <p className="text-muted-foreground text-sm mb-4">or click to browse your computer</p>
          <Button variant="secondary" size="sm" disabled={isLoading}>
            Select File
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  )
}
