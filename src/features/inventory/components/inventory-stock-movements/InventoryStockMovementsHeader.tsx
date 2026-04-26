import { Download, RefreshCw, Sparkles, Plus, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InventoryStockMovementsHeaderProps = {
  title: string
  updatedAtLabel: string
  onRefresh?: () => void
  onExport?: () => void
  onQuickImport?: () => void
  onQuickExport?: () => void
  isRefreshing?: boolean
}

export function InventoryStockMovementsHeader({
  title,
  subtitle,
  updatedAtLabel,
  suggestedActionLabel,
  onRefresh,
  onExport,
  onQuickImport,
  onQuickExport,
  isRefreshing,
}: InventoryStockMovementsHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-100 bg-white bg-abstract-geometric p-4 shadow-sm xl:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 shadow-inner">
             <Sparkles className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h1>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{updatedAtLabel}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Lazada Live</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-slate-100">
            <Button
              type="button"
              onClick={onQuickImport}
              className="h-9 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <Plus className="mr-1.5 size-3.5" />
              Nhập kho
            </Button>
            <Button
              type="button"
              onClick={onQuickExport}
              className="h-9 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
            >
              <Minus className="mr-1.5 size-3.5" />
              Xuất kho
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
          >
            <RefreshCw className={cn('mr-2 size-3.5', isRefreshing && 'animate-spin')} />
            Làm mới
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-9 rounded-xl border-slate-100 bg-slate-50 px-3 text-xs font-bold text-slate-600 shadow-none hover:bg-white"
          >
            <Download className="mr-2 size-3.5" />
            Xuất log
          </Button>
        </div>
      </div>
    </header>
  )
}
der>
  )
}
