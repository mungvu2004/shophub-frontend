import { BellRing, ShieldAlert, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TopCompetitorCard } from '@/features/products/components/products-competitor-tracking/TopCompetitorCard'
import type { CompetitorTrackingViewModel } from '@/features/products/logic/productsCompetitorTracking.types'

type CompetitorSidebarProps = {
  model: CompetitorTrackingViewModel
}

export function CompetitorSidebar({ model }: CompetitorSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Trophy className="size-5 text-amber-500" />
            Top đối thủ
          </h3>
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sức mạnh shop
          </Badge>
        </div>
        <div className="mt-5 space-y-4">
          {model.topCompetitors.map((competitor) => (
            <TopCompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
        <Button variant="ghost" className="mt-4 w-full text-xs font-bold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
          Xem tất cả đối thủ
        </Button>
      </article>

      <article className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-rose-50/50">
        <div className="bg-gradient-to-r from-rose-50 to-white p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <BellRing className="size-5 text-rose-500" />
            Cảnh báo Giá
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Nhận thông báo khi đối thủ hạ giá vượt ngưỡng quy định.
          </p>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Ngưỡng cảnh báo (%)
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                <ShieldAlert className="size-4 text-slate-400" />
                <Input
                  value={model.thresholdPercentInput}
                  onChange={(event) => model.onThresholdChange(event.target.value)}
                  className="h-7 border-none p-0 text-base font-bold shadow-none focus-visible:ring-0"
                />
                <span className="font-bold text-slate-400">%</span>
              </div>
            </div>
            
            <Button className="w-full h-11 bg-rose-600 font-bold text-white shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">
              Lưu cấu hình cảnh báo
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
