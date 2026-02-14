import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AlertCircle, Loader, Send } from 'lucide-react'
import { api, Followup } from '../lib/api'

interface FollowupPanelProps {
  reportId: string
}

export default function FollowupPanel({ reportId }: FollowupPanelProps) {
  const [followups, setFollowups] = useState<Followup[]>([])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsFetching(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await api.addFollowup(reportId, question)
      setFollowups([...followups, result])
      setQuestion('')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit question'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 flex flex-col h-full gap-4">
      <h2 className="text-lg font-bold text-white">Follow-up Questions</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex gap-2 items-start">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="flex-1 space-y-4 min-h-0 overflow-y-auto">
        {followups.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No follow-up questions yet</p>
        ) : (
          followups.map(followup => (
            <div key={followup.id} className="bg-slate-800/50 rounded p-3 space-y-2">
              <p className="text-blue-400 text-sm font-medium">Q: {followup.question}</p>
              <div className="text-slate-300 text-sm [&_*]:text-slate-300 [&_*]:text-sm">
                <ReactMarkdown>{followup.answer}</ReactMarkdown>
              </div>
              <p className="text-slate-500 text-xs">{new Date(followup.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 border-t border-slate-800 pt-4 mt-auto">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          rows={3}
          className="w-full bg-slate-800 rounded p-2 text-sm text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send
            </>
          )}
        </button>
      </form>
    </div>
  )
}
