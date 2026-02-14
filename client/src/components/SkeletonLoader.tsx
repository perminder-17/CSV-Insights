import { clsx } from 'clsx'

interface SkeletonLoaderProps {
  count?: number
  height?: string
  className?: string
}

export function SkeletonLoader({ count = 1, height = 'h-12', className }: SkeletonLoaderProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'bg-gray-800 rounded-lg animate-pulse',
            height,
            className
          )}
        />
      ))}
    </div>
  )
}
