import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'

type LoadingSkeletonProps = {
  rows?: number
  className?: string
}

export function LoadingSkeleton({ rows = 4, className }: LoadingSkeletonProps) {
  const safeRows = Math.max(1, rows)

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: safeRows }).map((_, index) => (
        <Skeleton
          key={`loading-row-${index}`}
          className={cn(
            'h-4 w-full rounded-md',
            index === 0 && 'h-5 w-2/3',
            index === safeRows - 1 && safeRows > 1 && 'w-1/2',
          )}
        />
      ))}
    </div>
  )
}
