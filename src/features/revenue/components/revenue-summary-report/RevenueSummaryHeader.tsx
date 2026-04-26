import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import type { RevenueRange, RevenueSummaryPlatformFilter } from '@/types/revenue.types'

type RevenueSummaryHeaderProps = {
  title: string
  selectedRange: RevenueRange
  selectedPlatform: RevenueSummaryPlatformFilter
  onRangeChange: (range: RevenueRange) => void
  onPlatformChange: (platform: RevenueSummaryPlatformFilter) => void
  onExportPdf: () => void
}

const ranges: Array<{ value: RevenueRange; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'quarter', label: 'Quý' },
  { value: 'year', label: 'Năm' },
]

const platforms: Array<{ value: RevenueSummaryPlatformFilter; label: string }> = [
  { value: 'all', label: 'Tất cả sàn' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiktok', label: 'TikTok Shop' },
]

export function RevenueSummaryHeader({
  title,
  selectedRange,
  selectedPlatform,
  onRangeChange,
  onPlatformChange,
  onExportPdf,
}: RevenueSummaryHeaderProps) {
  return (
    <header className="rounded-[28px] border border-slate-200/80 bg-white/90 bg-abstract-geometric px-4 py-4 shadow-[0_14px_50px_rgba(15,23,42,0.06)] backdrop-blur md:px-6 md:py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">Tổng quan doanh thu, lợi nhuận và hiệu quả theo từng sàn</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-2xl border border-indigo-100 bg-indigo-50 p-1 shadow-sm">
            {ranges.map((range) => {
              const isActive = selectedRange === range.value

              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => onRangeChange(range.value)}
                  className={
                    isActive
                      ? 'rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                      : 'rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition hover:text-slate-900'
                  }
                >
                  {range.label}
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <div className="flex flex-wrap gap-1">
              {platforms.map((platform) => {
                const isActive = selectedPlatform === platform.value

                return (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => onPlatformChange(platform.value)}
                    className={cn(
                      'rounded-xl px-4 py-2 text-xs font-semibold transition',
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                    aria-pressed={isActive}
                  >
                    {platform.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            type="button"
            onClick={onExportPdf}
            variant="outline"
            size="lg"
            className="gap-2 rounded-2xl bg-white px-5 shadow-sm"
          >
            <CalendarDays className="size-4" />
            <span>Xuất PDF</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
