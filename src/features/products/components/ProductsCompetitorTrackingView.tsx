import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CompetitorComparisonTable } from '@/features/products/components/products-competitor-tracking/CompetitorComparisonTable'
import { CompetitorHeatmapGrid } from '@/features/products/components/products-competitor-tracking/CompetitorHeatmapGrid'
import { CompetitorSidebar } from '@/features/products/components/products-competitor-tracking/CompetitorSidebar'
import type { CompetitorTrackingViewModel } from '@/features/products/logic/productsCompetitorTracking.types'

export function ProductsCompetitorTrackingView({ model }: { model: CompetitorTrackingViewModel }) {
  if (model.isError) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="text-base font-semibold">Không thể tải dữ liệu theo dõi đối thủ</p>
        <p className="mt-1 text-sm">{model.errorMessage}</p>
        <Button variant="outline" className="mt-4" onClick={model.onRefresh}>
          Thử lại
        </Button>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-100/60 px-4 py-3 text-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          <p className="text-sm font-medium">{model.alertBanner.matchedCount} {model.alertBanner.message}</p>
        </div>
        <Button className="h-8 bg-indigo-700 px-4 text-sm font-semibold hover:bg-indigo-800">Xem ngay</Button>
      </section>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Theo dõi Đối thủ</h1>
          <p className="mt-1 text-base text-slate-500">Giám sát giá {model.totalProductsTracked} đối thủ trên ba nền tảng</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-11 border-indigo-300 px-6 text-indigo-600">
            Cài đặt cảnh báo
          </Button>
          <Button className="h-11 bg-gradient-to-r from-indigo-700 to-indigo-500 px-6 font-semibold shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-indigo-600">
            Thêm đối thủ theo dõi
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CompetitorComparisonTable model={model} />
        <CompetitorSidebar model={model} />
      </section>

      <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Bản đồ nhiệt Vị thế Giá</h3>
            <p className="text-sm text-slate-500">Phân bố đối thủ theo danh mục và khoảng giá</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Số lượng đối thủ: ít - nhiều</p>
        </div>

        <div className="mt-5">
          <CompetitorHeatmapGrid rows={model.heatmap} />
        </div>
      </article>
    </div>
  )
}
