import { cn } from '@/lib/utils'

type DataLoadErrorStateProps = {
  title: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export function DataLoadErrorState({
  title,
  description,
  retryLabel = 'Thử lại',
  onRetry,
  className,
}: DataLoadErrorStateProps) {
  return (
    <div className={cn('space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8', className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-rose-700">{title}</p>
        {description ? <p className="text-xs text-rose-600">{description}</p> : null}
      </div>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}