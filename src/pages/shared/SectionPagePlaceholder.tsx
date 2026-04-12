import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SectionPagePlaceholderProps = {
  title: string
  description: string
  badgeLabel?: string
  helperText?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
}

export function SectionPagePlaceholder({
  title,
  description,
  badgeLabel = 'Coming Soon',
  helperText = 'Trang này đang được hoàn thiện theo roadmap sản phẩm.',
  action,
  icon,
}: SectionPagePlaceholderProps) {
  return (
    <Card className="max-w-3xl border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/70 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {icon ? (
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              {icon}
            </span>
          ) : null}

          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-700">
            {badgeLabel}
          </span>
        </div>

        <CardTitle className="text-2xl tracking-tight text-slate-900">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <p className="text-xs text-slate-500">{helperText}</p>

        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex h-9 items-center rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(79,70,229,0.25)] transition hover:opacity-95"
          >
            {action.label}
          </button>
        ) : null}
      </CardContent>
    </Card>
  )
}

