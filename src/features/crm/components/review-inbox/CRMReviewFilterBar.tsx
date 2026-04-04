import { ChevronDown, WandSparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { crmReviewSortOptions, crmReviewStatusTabs } from '@/features/crm/logic/crmReviewInbox.logic'
import type { CRMReviewFilterStatus, CRMReviewInboxSummary, CRMReviewSort } from '@/types/crm.types'

type CRMReviewFilterBarProps = {
  status: CRMReviewFilterStatus
  sort: CRMReviewSort
  summary: CRMReviewInboxSummary | null
  onStatusChange: (status: CRMReviewFilterStatus) => void
  onSortChange: (sort: CRMReviewSort) => void
}

export function CRMReviewFilterBar({
  status,
  sort,
  summary,
  onStatusChange,
  onSortChange,
}: CRMReviewFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-xl bg-slate-100 p-1">
        {crmReviewStatusTabs.map((tab) => {
          const isActive = status === tab.id
          const count = summary?.[tab.countKey] ?? 0

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={cn(
                'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
                isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-700 hover:bg-white/70',
              )}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-xl border-indigo-200 bg-indigo-50/50 px-4 text-xs font-bold text-indigo-600"
      >
        <WandSparkles className="mr-1 h-3.5 w-3.5" />
        Phản hồi hàng loạt
      </Button>

      <label className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
        <span>{crmReviewSortOptions.find((option) => option.id === sort)?.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        <select
          className="absolute h-0 w-0 opacity-0"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CRMReviewSort)}
          aria-label="Sắp xếp review"
        >
          {crmReviewSortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
