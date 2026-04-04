import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TopCompetitorCard } from '@/features/products/components/products-competitor-tracking/TopCompetitorCard'
import type { CompetitorTrackingViewModel } from '@/features/products/logic/productsCompetitorTracking.types'

type CompetitorSidebarProps = {
  model: CompetitorTrackingViewModel
}

export function CompetitorSidebar({ model }: CompetitorSidebarProps) {
  return (
    <div className="space-y-6">
      <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Top đối thủ đang theo dõi</h3>
        <div className="mt-4 space-y-3">
          {model.topCompetitors.map((competitor) => (
            <TopCompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Cài đặt Cảnh báo Giá</h3>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Ngưỡng cảnh báo</p>
        <label className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <Input
            value={model.thresholdPercentInput}
            onChange={(event) => model.onThresholdChange(event.target.value)}
            className="h-8 border-none px-0 shadow-none focus-visible:ring-0"
          />
          <span className="text-sm font-semibold text-slate-500">%</span>
        </label>
        <Button className="mt-4 w-full bg-indigo-600 font-semibold hover:bg-indigo-700">Lưu cài đặt</Button>
      </article>
    </div>
  )
}
