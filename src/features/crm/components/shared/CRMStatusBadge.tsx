import { cn } from '@/lib/utils'

export type CRMStatusVariant =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'replied'
  | 'unreplied'
  | 'priority'
  | 'vip_gold'
  | 'regular_blue'
  | 'at_risk_red'
  | 'active'
  | 'inactive'
  | 'running'
  | 'completed'
  | 'error'

const VARIANT_CLASSES: Record<CRMStatusVariant, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral: 'bg-amber-50 text-amber-700 border-amber-200',
  negative: 'bg-red-50 text-red-600 border-red-200',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unreplied: 'bg-slate-100 text-slate-600 border-slate-200',
  priority: 'bg-orange-50 text-orange-600 border-orange-200',
  vip_gold: 'bg-amber-50 text-amber-700 border-amber-200',
  regular_blue: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  at_risk_red: 'bg-red-50 text-red-600 border-red-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  running: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-red-50 text-red-600 border-red-200',
}

type CRMStatusBadgeProps = {
  variant: CRMStatusVariant
  label: string
  className?: string
  size?: 'sm' | 'md'
}

export function CRMStatusBadge({ variant, label, className, size = 'sm' }: CRMStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold uppercase tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
