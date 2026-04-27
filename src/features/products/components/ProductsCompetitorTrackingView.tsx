import { Eye, Settings2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { CompetitorComparisonTable } from '@/features/products/components/products-competitor-tracking/CompetitorComparisonTable'
import { CompetitorHeatmapGrid } from '@/features/products/components/products-competitor-tracking/CompetitorHeatmapGrid'
import { CompetitorSidebar } from '@/features/products/components/products-competitor-tracking/CompetitorSidebar'
import { CompetitorKpiSection } from '@/features/products/components/products-competitor-tracking/CompetitorKpiSection'
import type { CompetitorTrackingViewModel } from '@/features/products/logic/productsCompetitorTracking.types'

export function ProductsCompetitorTrackingView({ model }: { model: CompetitorTrackingViewModel }) {
  if (model.isError) {
    return (
      <DataLoadErrorState 
        title="Không thể tải dữ liệu theo dõi đối thủ" 
        onRetry={model.onRefresh} 
      />
    )
  }

  if (model.isLoading && model.totalProductsTracked === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Đang khởi tạo dữ liệu đối thủ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <ThemedPageHeader
        title="Theo dõi Đối thủ"
        subtitle={`Giám sát vị thế giá của ${model.totalProductsTracked} sản phẩm trên các nền tảng thương mại điện tử.`}
        theme="products"
        badge={{ text: 'Competitor Intelligence', icon: <Eye className="size-3.5" /> }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-11 border-indigo-200 bg-white/80 px-5 text-indigo-700 shadow-sm backdrop-blur transition-all hover:bg-indigo-50">
            <Settings2 className="mr-2 size-4" />
            Cấu hình quét giá
          </Button>
          <Button className="h-11 bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 font-bold text-white shadow-lg shadow-indigo-100 hover:from-indigo-800 hover:to-indigo-700">
            <UserPlus className="mr-2 size-4" />
            Thêm đối thủ mới
          </Button>
        </div>
      </ThemedPageHeader>

      {/* KPI Section */}
      <CompetitorKpiSection 
        totalProducts={model.totalProductsTracked}
        avgPriceDiff={model.avgPriceDiff}
        totalAlerts={model.totalAlerts}
        topPlatform={model.topPlatform}
      />

      {/* Main Analysis Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 xl:col-span-2">
          {/* Detailed Table Section */}
          <CompetitorComparisonTable model={model} />

          {/* Heatmap Section */}
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.4)]">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-50 pb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bản đồ nhiệt Vị thế Giá</h3>
                <p className="text-sm text-slate-500">Phân bố mật độ đối thủ theo danh mục và khoảng giá</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="size-3 rounded-sm bg-indigo-100" />
                   <span className="text-[11px] font-medium text-slate-400 uppercase">Thấp</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="size-3 rounded-sm bg-indigo-600" />
                   <span className="text-[11px] font-medium text-slate-400 uppercase">Cao</span>
                 </div>
              </div>
            </div>

            <div className="mt-6">
              <CompetitorHeatmapGrid rows={model.heatmap} />
            </div>
          </article>
        </div>

        {/* Right Column (1/3) - Sidebar */}
        <div className="h-full">
          <CompetitorSidebar model={model} />
        </div>
      </div>
    </div>
  )
}
