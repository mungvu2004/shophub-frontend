import { CalendarDays, TrendingUp, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import type { RevenueRange, RevenueSummaryPlatformFilter } from '@/types/revenue.types'

type RevenueSummaryHeaderProps = {
  title: string
  selectedRange: RevenueRange
  selectedPlatform: RevenueSummaryPlatformFilter
  onRangeChange: (range: RevenueRange) => void
  onPlatformChange: (platform: RevenueSummaryPlatformFilter) => void
  onExportPdf: () => void
  onRefresh?: () => void
  isExporting?: boolean
  isRefreshing?: boolean
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
  onRefresh,
  isExporting = false,
  isRefreshing = false,
}: RevenueSummaryHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle="Tổng quan doanh thu, lợi nhuận và hiệu quả theo từng sàn"
      theme="revenue"
      badge={{ text: 'Summary', icon: <TrendingUp className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-2xl border border-indigo-100 bg-indigo-50/50 p-1 shadow-sm backdrop-blur">
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

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur">
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

        {onRefresh && (
          <Button
            type="button"
            onClick={onRefresh}
            variant="outline"
            size="lg"
            disabled={isRefreshing}
            isLoading={isRefreshing}
            loadingText="Đang tải..."
            className="gap-2 rounded-2xl bg-white/80 px-5 shadow-sm backdrop-blur"
          >
            <RefreshCcw className="size-4" />
            <span>Làm mới</span>
          </Button>
        )}
        <Button
          type="button"
          onClick={onExportPdf}
          variant="outline"
          size="lg"
          disabled={isExporting}
          isLoading={isExporting}
          loadingText="Đang xuất..."
          className="gap-2 rounded-2xl bg-white/80 px-5 shadow-sm backdrop-blur"
        >
          <CalendarDays className="size-4" />
          <span>Xuất PDF</span>
        </Button>
      </div>
    </ThemedPageHeader>
  )
}
