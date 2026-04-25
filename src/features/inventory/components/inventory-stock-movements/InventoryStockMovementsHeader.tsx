import { Download, RefreshCw, Plus, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InventoryStockMovementsHeaderProps = {
  title: string
  subtitle: string
  updatedAtLabel: string
  suggestedActionLabel: string
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
  onRefresh,
  onExport,
  onQuickImport,
  onQuickExport,
  isRefreshing,
}: InventoryStockMovementsHeaderProps) {
  return (
    <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between border-b border-secondary-100 pb-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-100 fill-mode-both">
      <div className="space-y-1.5">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">
          <span>Kho hàng</span>
          <span className="h-px w-4 bg-secondary-200" />
          <span className="text-primary-600 font-bold uppercase tracking-[0.1em]">Nhập / Xuất kho</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-secondary-900 xl:text-4xl italic">
          {title}
        </h1>
        <p className="text-sm font-medium text-secondary-500 leading-relaxed max-w-2xl">
          {subtitle} • <span className="text-secondary-400 font-bold italic">Cập nhật: {updatedAtLabel}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2 border-r border-secondary-100 pr-4">
           <Button 
            onClick={onQuickImport}
            className="h-10 rounded-xl bg-indigo-600 font-bold text-[11px] uppercase tracking-widest text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
           >
              <Plus className="mr-2 size-3.5" />
              Nhập hàng
           </Button>
           <Button 
            onClick={onQuickExport}
            variant="outline"
            className="h-10 rounded-xl border-secondary-200 font-bold text-[11px] uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 transition-all active:scale-95"
           >
              <Minus className="mr-2 size-3.5" />
              Xuất kho
           </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="size-10 rounded-xl text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
        >
          <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onExport}
          className="h-10 rounded-xl border-secondary-200 font-bold text-[11px] uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 shadow-sm transition-all"
        >
          <Download className="mr-2 size-3.5" />
          Báo cáo
        </Button>
      </div>
    </header>
  )
}
