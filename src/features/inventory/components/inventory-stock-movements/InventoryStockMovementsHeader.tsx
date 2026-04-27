import { Download, RefreshCw, Plus, Minus, ArrowRightLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

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
  updatedAtLabel,
  onRefresh,
  onExport,
  onQuickImport,
  onQuickExport,
  isRefreshing,
}: InventoryStockMovementsHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{updatedAtLabel}</span>
          <div className="size-1 rounded-full bg-emerald-300" />
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
             <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Lazada Live
          </span>
        </div>
      }
      theme="inventory"
      badge={{ text: 'Stock Movements', icon: <ArrowRightLeft className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-emerald-200/50">
          <Button
            type="button"
            onClick={onQuickImport}
            className="h-10 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <Plus className="mr-1.5 size-4" />
            Nhập kho
          </Button>
          <Button
            type="button"
            onClick={onQuickExport}
            className="h-10 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
          >
            <Minus className="mr-1.5 size-4" />
            Xuất kho
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-10 rounded-xl text-xs font-bold text-emerald-900 hover:bg-white/80 hover:text-emerald-700"
        >
          <RefreshCw className={cn('mr-2 size-4', isRefreshing && 'animate-spin')} />
          Làm mới
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="h-10 rounded-xl border-emerald-200/50 bg-white/80 backdrop-blur px-4 text-xs font-bold text-emerald-900 shadow-sm hover:bg-white"
        >
          <Download className="mr-2 size-4" />
          Xuất log
        </Button>
      </div>
    </ThemedPageHeader>
  )
}