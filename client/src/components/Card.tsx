import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('bg-card border border-border rounded-lg p-6', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={clsx('text-2xl font-bold text-foreground', className)}>{children}</h2>
}

export function CardDescription({ children, className }: CardProps) {
  return <p className={clsx('text-muted-foreground text-sm', className)}>{children}</p>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={clsx('', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={clsx('mt-6 flex gap-4', className)}>{children}</div>
}
