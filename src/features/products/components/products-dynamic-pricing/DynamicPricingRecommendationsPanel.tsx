import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DynamicPricingRecommendationsTable } from '@/features/products/components/products-dynamic-pricing/DynamicPricingRecommendationsTable'
import type { DynamicPricingRecommendation } from '@/features/products/logic/productsDynamicPricing.types'

type DynamicPricingRecommendationsPanelProps = {
  totalSuggestions: number
  displayedSuggestions: number
  rows: DynamicPricingRecommendation[]
  isApplyingAll: boolean
  onApplyAll: () => void
  onOpenProductDetail: (productId: string) => void
}

export function DynamicPricingRecommendationsPanel({
  totalSuggestions,
  displayedSuggestions,
  rows,
  isApplyingAll,
  onApplyAll,
  onOpenProductDetail,
}: DynamicPricingRecommendationsPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-slate-900">Gợi ý giá AI - Chờ xác nhận</h3>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            {totalSuggestions} gợi ý
          </span>
        </div>

        <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <DynamicPricingRecommendationsTable rows={rows} onOpenProductDetail={onOpenProductDetail} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
        <p className="text-sm text-slate-500">Hiển thị {displayedSuggestions} / {totalSuggestions} gợi ý mới nhất</p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 px-4 text-slate-600"
            onClick={() => {
              const firstProductId = rows[0]?.productId
              if (!firstProductId) return
              onOpenProductDetail(firstProductId)
            }}
          >
            Xem lại từng gợi ý
          </Button>
          <Button
            className="h-10 bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 text-white shadow-sm hover:from-indigo-700 hover:to-indigo-600"
            onClick={onApplyAll}
            disabled={isApplyingAll || totalSuggestions <= 0}
          >
            {isApplyingAll ? 'Đang áp dụng...' : `Áp dụng tất cả ${totalSuggestions} gợi ý`}
          </Button>
        </div>
      </div>
    </section>
  )
}
