import { Download, RefreshCw, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InventoryStockMovementsHeaderProps = {
  title: string
  subtitle: string
  updatedAtLabel: string
  suggestedActionLabel: string
  onRefresh?: () => void
  onExport?: () => void
  isRefreshing?: boolean
}

export function InventoryStockMovementsHeader({
  title,
  subtitle,
  updatedAtLabel,
  suggestedActionLabel,
  onRefresh,
  onExport,
  isRefreshing,
}: InventoryStockMovementsHeaderProps) {
  return (
    <header className="rounded-[28px] border border-white/70 bg-gradient-to-br from-white via-[#f8faff] to-[#eff3ff] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] xl:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
            <Sparkles className="size-3.5" />
            Stock movement cockpit
          </div>

          <div>
            <h1 className="text-[30px] font-bold tracking-[-0.05em] text-[#111c2d] md:text-[40px]">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-[15px]">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">{updatedAtLabel}</span>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[#4f46e5]">Lazada đã được tách thành kênh riêng</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={cn('mr-2 size-4', isRefreshing && 'animate-spin')} />
            Làm mới
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-11 rounded-xl border-[#d9e3ff] bg-[#eef2ff] px-4 text-sm font-semibold text-[#3525cd] shadow-none hover:bg-[#e6ebff]"
          >
            <Download className="mr-2 size-4" />
            Xuất log
          </Button>

          <Button
            type="button"
            className="h-11 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#4f46e5] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.25)] hover:opacity-95"
          >
            {suggestedActionLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}