import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info'
  className?: string
}

export function Badge({ children, variant = 'info', className }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    error: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  }

  return (
    <span className={clsx('px-3 py-1 rounded-full text-sm font-medium inline-block', variants[variant], className)}>
      {children}
    </span>
  )
}
