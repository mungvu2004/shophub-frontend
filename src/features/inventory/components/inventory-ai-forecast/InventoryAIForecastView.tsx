import { AlertTriangle, Bot, CalendarClock, Circle, FileDown, Lightbulb, PackagePlus, RefreshCcw, ShoppingCart, Sparkles, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type {
  ForecastTableFilter,
  InventoryAIForecastTableRowViewModel,
  InventoryAIForecastViewModel,
} from '@/features/inventory/logic/inventoryAIForecast.types'
import { ForecastAccuracySection } from './sections/ForecastAccuracySection'
import { ForecastParameterForm } from './sections/ForecastParameterForm'
import { InboundPlanningSection } from './sections/InboundPlanningSection'
import { SeasonalityPatternCard } from './sections/SeasonalityPatternCard'

type InventoryAIForecastViewProps = {
  model: InventoryAIForecastViewModel
  selectedFilter: ForecastTableFilter
  filteredRows: InventoryAIForecastTableRowViewModel[]
  isRecalculating: boolean
  onFilterChange: (filter: ForecastTableFilter) => void
  onOpenDetail: (sku: string) => void
  onRecalculate: (params: any) => void
  onRefresh: () => void
  onExport: () => void
}

const statusMapping: Record<InventoryAIForecastTableRowViewModel['status'], { variant: "success" | "warning" | "danger" | "info" | "outline"; label: string; icon: any }> = {
  urgent: { variant: 'danger', label: 'Cần nhập gấp', icon: AlertTriangle },
  warning: { variant: 'warning', label: 'Tồn kho thấp', icon: Info },
  healthy: { variant: 'success', label: 'An toàn', icon: Circle },
}

export function InventoryAIForecastView({
  model,
  selectedFilter,
  filteredRows,
  isRecalculating,
  onFilterChange,
  onOpenDetail,
  onRecalculate,
  onRefresh,
  onExport,
}: InventoryAIForecastViewProps) {
  const handleQuickRestock = (e: React.MouseEvent, sku: string, productName: string) => {
    e.stopPropagation()
    toast.success(`Đã thêm ${productName} (${sku}) vào danh sách nhập hàng ưu tiên!`)
  }

  const handleAddToCart = (e: React.MouseEvent, sku: string) => {
    e.stopPropagation()
    toast.success(`Đã thêm SKU ${sku} vào giỏ nhập hàng.`)
  }

  return (
    <div className="space-y-6 pb-12 pt-1">
      {/* HEADER */}
      <header className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm xl:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 shadow-inner">
               <Sparkles className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{model.title}</h1>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{model.modelAccuracyLabel} Accuracy</span>
                <div className="size-1 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest italic">AI Engine Live</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onRefresh}
              className="h-9 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              <RefreshCcw className="mr-2 size-3.5" />
              Làm mới dữ liệu
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onExport}
              className="h-9 rounded-xl border-slate-100 bg-slate-50 px-3 text-xs font-bold text-slate-600 shadow-none hover:bg-white"
            >
              <FileDown className="mr-2 size-3.5" />
              Xuất kế hoạch nhập hàng
            </Button>
          </div>
        </div>
      </header>

      {/* METRICS & ACCURACY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
         <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Trạng thái hệ thống', value: model.modelStatusText, icon: <Circle className="size-3 fill-emerald-500 text-emerald-500 animate-pulse" /> },
              { label: 'Nguồn dữ liệu', value: model.modelInputLabel, icon: <TrendingUp className="size-5 text-primary-500" /> },
              { label: 'Đồng bộ lần cuối', value: model.modelRunLabel, icon: <CalendarClock className="size-5 text-secondary-300" /> }
            ].map((m, i) => (
               <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                     <p className="text-sm font-bold text-slate-900">{m.value}</p>
                  </div>
                  {m.icon}
               </div>
            ))}
         </div>
         <div className="xl:col-span-4">
            <ForecastAccuracySection accuracy={model.accuracy} />
         </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* LEFT COLUMN: ALERTS, PLANNING & TABLE */}
        <div className="space-y-6 xl:col-span-8">
          {/* URGENT LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cảnh báo khẩn cấp</p>
              <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                {model.urgentCards.length} rủi ro đứt hàng
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {model.urgentCards.map((card) => (
                <article
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenDetail(card.sku)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpenDetail(card.sku)
                    }
                  }}
                  className="group relative cursor-pointer rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                        <AlertTriangle className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{card.productName}</h3>
                        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{card.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tồn kho</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">{card.currentStockLabel}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dự kiến hết</p>
                        <p className="text-xl font-black text-red-600 tabular-nums">{card.stockoutLabel}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={(e) => handleQuickRestock(e, card.sku, card.productName)}
                        className="h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest px-4"
                      >
                        <PackagePlus className="mr-2 size-4" />
                        Nhập ngay
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* INBOUND PLANNING — Moved to main column for better visibility */}
          <InboundPlanningSection plan={model.inboundPlan} />

          {/* MAIN TABLE */}
          <div className="space-y-4">
             <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Toàn bộ danh mục</p>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
                   {model.tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={cn(
                           "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                           selectedFilter === tab.id ? "bg-white text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                         {tab.label}
                      </button>
                   ))}
                </div>
             </div>

             <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                   <table className="w-full text-left" aria-label="Bảng dự báo tồn kho AI">
                      <thead className="bg-slate-50/50 border-b border-slate-50">
                         <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Tồn kho</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Gợi ý</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {filteredRows.map(row => (
                            <tr
                               key={row.id}
                               role="button"
                               tabIndex={0}
                               className="group hover:bg-slate-50/50 cursor-pointer transition-colors focus-within:bg-slate-50/50 focus-within:outline-none"
                               onClick={() => onOpenDetail(row.sku)}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter' || e.key === ' ') {
                                   e.preventDefault()
                                   onOpenDetail(row.sku)
                                 }
                               }}
                            >
                               <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{row.sku}</td>
                               <td className="px-6 py-4 text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{row.productName}</td>
                               <td className="px-6 py-4 text-right font-mono text-sm font-bold text-slate-600">{row.currentStockLabel}</td>
                               <td className="px-6 py-4 text-center">
                                  <Badge variant={statusMapping[row.status].variant} className="text-[9px] font-black uppercase rounded-lg border-none shadow-none">
                                     {statusMapping[row.status].label}
                                  </Badge>
                               </td>
                               <td className="px-6 py-4 text-right font-mono text-sm font-bold text-primary-600">{row.suggestedInboundLabel}</td>
                               <td className="px-6 py-4 text-center">
                                  <button 
                                     onClick={(e) => handleAddToCart(e, row.sku)}
                                     className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-all mx-auto focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  >
                                     <ShoppingCart className="size-3.5" />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PARAMETERS, SEASONALITY & INSIGHTS */}
        <div className="xl:col-span-4 space-y-6">
          {/* PARAMETERS FORM — High interactive tool */}
          <ForecastParameterForm isRecalculating={isRecalculating} onRecalculate={onRecalculate} />

          {/* SEASONALITY ANALYSIS — Visual context */}
          <SeasonalityPatternCard patterns={model.seasonalityPatterns} />

          {/* WATCHLIST — Quick reference */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col h-full min-h-[400px]">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Cần theo dõi sát</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[9px] font-black text-slate-400 border border-slate-100">
                   <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   REALTIME
                </span>
             </div>
             
             <div className="flex-1 space-y-8">
                {model.watchCards.slice(0, 4).map(card => (
                   <div key={card.id} className="group cursor-pointer" onClick={() => onOpenDetail(card.sku)}>
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                               <Bot className="size-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{card.productName}</p>
                               <p className="text-sm font-black text-slate-900">Nhập {card.suggestedInboundLabel}</p>
                            </div>
                         </div>
                         <TrendingUp className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className="h-full bg-primary-500 w-[65%]" />
                      </div>
                   </div>
                ))}
             </div>

             <div className="mt-10 pt-6 border-t border-slate-50">
                <div className="rounded-2xl bg-indigo-600 p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-100">
                   <Lightbulb className="size-6 text-amber-300 mb-3" />
                   <p className="text-[10px] font-medium leading-relaxed text-indigo-50">
                      Mẹo: Đồng bộ hóa chiến dịch quảng cáo với ngày nhập hàng đề xuất để tối đa tỷ lệ sẵn hàng.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
