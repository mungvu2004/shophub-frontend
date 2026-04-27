import { Button } from '@/components/ui/button'
import { DynamicPricingHeader } from '@/features/products/components/products-dynamic-pricing/DynamicPricingHeader'
import { DynamicPricingInsightsRow } from '@/features/products/components/products-dynamic-pricing/DynamicPricingInsightsRow'
import { DynamicPricingPriceHistoryPanel } from '@/features/products/components/products-dynamic-pricing/DynamicPricingPriceHistoryPanel'
import { DynamicPricingCompetitorGapChart } from '@/features/products/components/products-dynamic-pricing/DynamicPricingCompetitorGapChart'
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

  if (model.isLoading && !model.payload.recommendations.length) {
    return (
      <div className="space-y-6 pb-10">
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 h-[724px] animate-pulse rounded-2xl bg-slate-100" />
          <div className="xl:col-span-4 space-y-6">
            <div className="h-[300px] animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-[400px] animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <DynamicPricingHeader
        title={model.payload.title}
        subtitle={model.payload.subtitle}
        applyAllLabel={model.payload.applyAllLabel}
        historyLabel={model.payload.historyLabel}
        onOpenHistory={model.onOpenHistory}
        onApplyAll={model.onApplyAll}
      />

      <DynamicPricingRulesSection
        rules={model.payload.rules}
        onToggleRule={model.onToggleRule}
        isTogglingRule={model.isTogglingRule}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex xl:col-span-8 min-h-[724px]">
          <DynamicPricingRecommendationsPanel
            title={model.payload.recommendationsTitle}
            totalSuggestions={model.payload.totalSuggestions}
            displayedSuggestions={model.payload.displayedSuggestions}
            rows={model.payload.recommendations}
            headers={model.payload.tableHeaders}
            approveLabel={model.payload.approveLabel}
            onApplyAll={model.onApplyAll}
            onOpenProductDetail={model.onOpenProductDetail}
            isApplyingAll={model.isApplyingAll}
          />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4 h-full">
          <div className="h-[300px] shrink-0">
            <DynamicPricingPriceHistoryPanel
              points={model.payload.historyPoints}
              summary={model.payload.historySummary}
              periodLabel={model.payload.periodLabel}
              productName={model.payload.selectedProductName}
            />
          </div>
          
          <div className="h-[400px] shrink-0">
            <DynamicPricingCompetitorGapChart
              gaps={model.payload.competitorGaps}
            />
          </div>
        </div>
      </section>

      <DynamicPricingInsightsRow insights={model.payload.insights} />
    </div>
  )
}
