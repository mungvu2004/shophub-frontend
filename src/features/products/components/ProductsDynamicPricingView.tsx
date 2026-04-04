import { Button } from '@/components/ui/button'
import { DynamicPricingHeader } from '@/features/products/components/products-dynamic-pricing/DynamicPricingHeader'
import { DynamicPricingInsightsRow } from '@/features/products/components/products-dynamic-pricing/DynamicPricingInsightsRow'
import { DynamicPricingPriceHistoryPanel } from '@/features/products/components/products-dynamic-pricing/DynamicPricingPriceHistoryPanel'
import { DynamicPricingRecommendationsPanel } from '@/features/products/components/products-dynamic-pricing/DynamicPricingRecommendationsPanel'
import { DynamicPricingRulesSection } from '@/features/products/components/products-dynamic-pricing/DynamicPricingRulesSection'
import type { DynamicPricingViewModel } from '@/features/products/logic/productsDynamicPricing.types'

type ProductsDynamicPricingViewProps = {
  model: DynamicPricingViewModel
}

export function ProductsDynamicPricingView({ model }: ProductsDynamicPricingViewProps) {
  if (model.isError) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <p className="text-base font-semibold">Không thể tải dữ liệu định giá động</p>
        <p className="mt-1 text-sm">{model.errorMessage}</p>
        <Button variant="outline" className="mt-4" onClick={model.onRetry}>
          Thử lại
        </Button>
      </section>
    )
  }

  if (model.isLoading) {
    return <div className="h-[420px] animate-pulse rounded-2xl bg-slate-100" />
  }

  return (
    <div className="space-y-6">
      <DynamicPricingHeader
        subtitle={model.payload.subtitle}
        onOpenHistory={model.onOpenHistory}
        onApplyAll={model.onApplyAll}
      />

      <DynamicPricingRulesSection
        rules={model.payload.rules}
        onToggleRule={model.onToggleRule}
        isTogglingRule={model.isTogglingRule}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <DynamicPricingRecommendationsPanel
            totalSuggestions={model.payload.totalSuggestions}
            displayedSuggestions={model.payload.displayedSuggestions}
            rows={model.payload.recommendations}
            onApplyAll={model.onApplyAll}
            onOpenProductDetail={model.onOpenProductDetail}
            isApplyingAll={model.isApplyingAll}
          />
        </div>

        <div className="xl:col-span-4">
          <DynamicPricingPriceHistoryPanel
            points={model.payload.historyPoints}
            summary={model.payload.historySummary}
            periodLabel={model.payload.periodLabel}
            productName={model.payload.selectedProductName}
          />
        </div>
      </section>

      <DynamicPricingInsightsRow insights={model.payload.insights} />
    </div>
  )
}
