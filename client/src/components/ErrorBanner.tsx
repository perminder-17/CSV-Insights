import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface ErrorBannerProps {
  children: ReactNode
  onClose?: () => void
  className?: string
}

export function ErrorBanner({ children, onClose, className }: ErrorBannerProps) {
  return (
    <div className={clsx('bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-start gap-3', className)}>
      <div className="text-rose-400 mt-0.5">
        <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 text-xs">!</div>
      </div>
      <div className="flex-1 text-rose-200 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-400 hover:text-rose-300 flex-shrink-0 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
