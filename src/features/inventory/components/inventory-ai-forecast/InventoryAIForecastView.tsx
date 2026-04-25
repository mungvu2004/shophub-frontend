import { AlertTriangle, Bot, CalendarClock, Circle, FileDown, Lightbulb, PackagePlus, RefreshCcw, ShoppingCart, Sparkles, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type {
  ForecastTableFilter,
  InventoryAIForecastTableRowViewModel,
  InventoryAIForecastViewModel,
} from '@/features/inventory/logic/inventoryAIForecast.types'

type InventoryAIForecastViewProps = {
  model: InventoryAIForecastViewModel
  selectedFilter: ForecastTableFilter
  filteredRows: InventoryAIForecastTableRowViewModel[]
  onFilterChange: (filter: ForecastTableFilter) => void
  onOpenDetail: (sku: string) => void
}

const statusMapping: Record<InventoryAIForecastTableRowViewModel['status'], { variant: "success" | "warning" | "danger" | "info" | "outline"; label: string; icon: any }> = {
  urgent: { variant: 'danger', label: 'Cần nhập ngay', icon: AlertTriangle },
  warning: { variant: 'warning', label: 'Tồn kho thấp', icon: Info },
  healthy: { variant: 'success', label: 'An toàn', icon: Circle },
}

export function InventoryAIForecastView({
  model,
  selectedFilter,
  filteredRows,
  onFilterChange,
  onOpenDetail,
}: InventoryAIForecastViewProps) {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {/* HEADER SECTION — Subtle Entrance */}
      <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between border-b border-secondary-100 pb-8 animate-in fade-in slide-in-from-top-4 duration-700 delay-100 fill-mode-both">
        <div className="space-y-1.5">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">
            <span>Kho hàng</span>
            <span className="h-px w-4 bg-secondary-200" />
            <span className="text-primary-600">Dự báo AI</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 xl:text-4xl flex items-center gap-3">
            {model.title}
            <div className="relative">
               <Sparkles className="size-6 text-primary-500 animate-pulse" />
               <div className="absolute inset-0 size-6 bg-primary-400 blur-xl opacity-20 animate-pulse" />
            </div>
          </h1>
          <p className="text-sm font-medium text-secondary-500 max-w-2xl leading-relaxed">
            {model.modelDescription} • <span className="text-success-600 font-bold inline-flex items-center gap-1.5">
              Độ chính xác {model.modelAccuracyLabel}
              <div className="size-1.5 rounded-full bg-success-500 animate-ping" />
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl border-secondary-200 font-bold text-[11px] uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 transition-all active:scale-95">
            <RefreshCcw className="mr-2 size-3.5" />
            Làm mới
          </Button>
          <Button className="h-10 rounded-xl bg-primary-600 font-bold text-[11px] uppercase tracking-widest text-white hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95">
            <FileDown className="mr-2 size-3.5" />
            Báo cáo
          </Button>
        </div>
      </header>

      {/* SYSTEM METRICS — Staggered Entrance */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
        {[
          { label: 'Trạng thái mô hình', value: model.modelStatusText, icon: <div className="size-2.5 rounded-full bg-success-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" /> },
          { label: 'Dữ liệu đầu vào', value: model.modelInputLabel, icon: <TrendingUp className="size-5 text-primary-500" /> },
          { label: 'Đồng bộ lần cuối', value: model.modelRunLabel, icon: <CalendarClock className="size-5 text-secondary-300" /> }
        ].map((metric, i) => (
          <div key={metric.label} className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-primary-100 group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-secondary-400 mb-1.5">{metric.label}</p>
              <p className="text-sm font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{metric.value}</p>
            </div>
            <div className="transition-transform duration-500 group-hover:scale-110">
               {metric.icon}
            </div>
          </div>
        ))}
      </section>

      {/* URGENT ALERTS — Hero Entrance */}
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 border border-danger-100 shadow-sm animate-bounce-slow">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-secondary-900 uppercase italic leading-none">{model.urgentTitle}</h2>
            <p className="text-[10px] font-black text-danger-500 uppercase tracking-widest mt-1">Ưu tiên xử lý cấp độ 1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {model.urgentCards.map((card) => (
            <article
              key={card.id}
              onClick={() => onOpenDetail(card.sku)}
              className="group relative bg-white rounded-[32px] border border-secondary-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-primary-200 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Animated Accent Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-primary-500 transition-all duration-700 group-hover:w-full" />
              
              <div className="flex items-center justify-between px-8 py-5 bg-secondary-50/50 border-b border-secondary-100 transition-colors group-hover:bg-primary-50/30">
                <div className="flex items-center gap-4">
                   <div className="bg-white p-2 rounded-2xl border border-secondary-100 shadow-sm group-hover:border-primary-200 group-hover:rotate-12 transition-all duration-500">
                     <Sparkles className="size-5 text-primary-600 animate-pulse" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-lg font-black text-secondary-900 leading-tight group-hover:text-primary-600 transition-colors">{card.productName}</h3>
                      <span className="text-[10px] font-black font-mono text-secondary-400 uppercase tracking-[0.2em]">{card.sku}</span>
                   </div>
                </div>
                <Badge className="bg-success-100 text-success-700 border-success-200 px-3 py-1 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm">
                  🎯 Tin cậy {card.confidenceLabel}
                </Badge>
              </div>

              <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 items-center">
                <div className="space-y-1.5 transition-transform duration-500 group-hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Tồn kho hiện tại</p>
                  <p className="text-3xl font-black font-mono text-secondary-900 tabular-nums">{card.currentStockLabel}</p>
                </div>
                <div className="space-y-1.5 transition-transform duration-500 group-hover:scale-105 delay-75">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Thời gian còn lại</p>
                  <p className="text-3xl font-black text-danger-600 tabular-nums flex items-center gap-3">
                    {card.stockoutLabel}
                  </p>
                </div>
                <div className="md:col-span-2 lg:col-span-2 space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Tại sao AI đề xuất?</p>
                   <div className="flex flex-wrap gap-2.5">
                      {card.reasons.map(reason => (
                        <span key={reason} className="text-[10px] font-bold bg-white text-secondary-500 px-3 py-1.5 rounded-xl border border-secondary-100 group-hover:border-primary-100 group-hover:text-primary-600 transition-all">
                          • {reason}
                        </span>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="rounded-2xl bg-primary-50 p-4 border border-primary-100/50 text-center transition-all group-hover:bg-primary-100/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">Gợi ý nhập</p>
                      <p className="font-mono text-2xl font-black text-primary-700 tabular-nums">{card.suggestedInboundLabel}</p>
                   </div>
                   <Button className="h-14 bg-secondary-900 hover:bg-primary-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary-200 transition-all active:scale-95 group/btn">
                      <PackagePlus className="mr-2 size-5 transition-transform group-hover/btn:scale-125" />
                      Nhập hàng ngay
                   </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WATCHLIST — Grid Interaction */}
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary-400 flex items-center gap-3">
          <div className="h-px w-8 bg-secondary-200" />
          {model.watchTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {model.watchCards.map((card) => (
            <article
              key={card.id}
              onClick={() => onOpenDetail(card.sku)}
              className="group relative bg-white rounded-3xl p-6 border border-secondary-100 transition-all duration-300 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">{card.productName}</h3>
                <Badge variant="outline" className="text-[9px] bg-secondary-50 font-bold border-secondary-100">{card.sku}</Badge>
              </div>
              <div className="space-y-4 border-t border-secondary-50 pt-6 mb-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-400">Tồn hiện tại</span>
                    <span className="font-bold font-mono text-secondary-900 tabular-nums">{card.currentStockLabel}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-400">Dự báo bán</span>
                    <span className="font-bold text-warning-600 tabular-nums">{card.forecastLabel}</span>
                 </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                 <div className="text-[10px] font-black uppercase tracking-widest text-primary-700 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 transition-colors group-hover:bg-primary-100">
                    Nhập: {card.suggestedInboundLabel}
                 </div>
                 <div className="size-8 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-300 transition-all group-hover:bg-secondary-900 group-hover:text-white group-hover:rotate-[360deg] duration-500">
                    <ShoppingCart className="size-4" />
                 </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MAIN DATA TABLE — Pure Clarity & Motion */}
      <section className="space-y-6 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-secondary-100">
          <div className="pb-4 space-y-1">
             <h2 className="text-xl font-bold text-secondary-900 tracking-tight">Danh sách dự báo AI</h2>
             <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">{model.totalRowsLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {model.tabs.map((tab) => {
              const isActive = tab.id === selectedFilter
              return (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange(tab.id)}
                  className={cn(
                    'px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative group/tab',
                    isActive ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-700'
                  )}
                >
                  {tab.label}
                  <div className={cn(
                    'absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300',
                    isActive ? 'w-full' : 'w-0 group-hover/tab:w-full'
                  )} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-secondary-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary-50/50">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Mã SKU</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary-400">Sản phẩm</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-secondary-400">Tồn kho</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-secondary-400">Bán TB</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-secondary-400">Tình trạng</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-secondary-400">Đề xuất</th>
                  <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-secondary-400">Tin cậy</th>
                  <th className="px-6 py-5 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-50">
                {filteredRows.map((row) => {
                  const config = statusMapping[row.status]
                  return (
                    <tr key={row.id} className="hover:bg-primary-50/30 transition-all group cursor-pointer" onClick={() => onOpenDetail(row.sku)}>
                      <td className="px-6 py-6 font-mono text-[10px] text-secondary-400 font-bold italic tracking-tighter">{row.sku}</td>
                      <td className="px-6 py-6 text-sm font-black text-secondary-900 group-hover:text-primary-600 transition-colors">{row.productName}</td>
                      <td className="px-6 py-6 text-right font-mono text-sm text-secondary-600 tabular-nums font-medium">{row.currentStockLabel}</td>
                      <td className="px-6 py-6 text-right font-mono text-sm text-secondary-600 tabular-nums font-medium">{row.avgDailySalesLabel}</td>
                      <td className="px-6 py-6 text-center">
                        <Badge variant={config.variant} className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-none transition-transform group-hover:scale-105">
                          <config.icon className="mr-1.5 size-3" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 text-right font-mono text-sm font-black text-primary-600 tabular-nums">{row.suggestedInboundLabel}</td>
                      <td className="px-6 py-6 text-center text-[10px] font-black text-secondary-400">{row.confidenceLabel}</td>
                      <td className="px-6 py-6 text-center">
                         <div className="size-9 rounded-2xl bg-secondary-100 flex items-center justify-center text-secondary-400 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-100 group-hover:-rotate-12 transition-all">
                            <ShoppingCart className="size-4" />
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 border-t border-secondary-50 bg-secondary-50/30 flex items-center justify-between">
             <p className="text-[10px] font-black text-secondary-300 uppercase tracking-[0.2em] italic">{model.totalRowsLabel}</p>
             <div className="flex items-center gap-8 text-[9px] font-black text-secondary-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><CalendarClock className="size-3.5" /> Sync: {model.generatedAtLabel}</span>
                <span className="text-primary-500/70 flex items-center gap-2 animate-pulse"><Sparkles className="size-3.5" /> AI Engine Connect</span>
             </div>
          </div>
        </div>
      </section>

      {/* AI INSIGHT BANNER — Animated Reveal */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-800 fill-mode-both">
        <div className="bg-secondary-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-secondary-300 group">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white/10 p-4 rounded-[24px] backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform duration-700">
                 <Lightbulb className="size-10 text-amber-300 animate-pulse" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400">AI Intelligence insight</p>
                 <p className="text-xl font-medium leading-relaxed max-w-4xl text-secondary-100">
                    Mô hình dự báo dựa trên chu kỳ kinh doanh bình thường. Cho kỳ <span className="text-white font-black italic underline decoration-amber-400 underline-offset-8 decoration-4 group-hover:decoration-primary-400 transition-all duration-700">Mega Sale 12.12</span>, hãy chủ động tăng mức dự phòng lên <span className="bg-primary-500 px-3 py-1 rounded-xl text-white font-black shadow-lg">15-20%</span> để tối ưu hóa doanh thu.
                 </p>
              </div>
           </div>
           {/* Dynamic Background Glow */}
           <div className="absolute right-0 top-0 size-96 bg-primary-600/20 blur-[120px] animate-pulse" />
           <div className="absolute -left-20 -bottom-20 size-64 bg-indigo-500/10 blur-[80px]" />
        </div>
      </section>
    </div>
  )
}
