import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AutomationLogsFooterProps = {
  totalLabel: string
  page: number
  totalPages: number
  onPageChange: (nextPage: number) => void
}

export function AutomationLogsFooter({ totalLabel, page, totalPages, onPageChange }: AutomationLogsFooterProps) {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-slate-100 px-6 py-3">
      <span className="text-[12px] font-medium text-slate-500">{totalLabel}</span>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon-xs" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="text-[12px] font-semibold text-slate-700">{page} / {totalPages}</span>
        <Button type="button" variant="outline" size="icon-xs" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </footer>
  )
}
