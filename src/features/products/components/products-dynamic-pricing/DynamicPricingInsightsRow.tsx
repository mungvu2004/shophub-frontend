import { DynamicPricingInsightCard } from '@/features/products/components/products-dynamic-pricing/DynamicPricingInsightCard'
import type { DynamicPricingInsight } from '@/features/products/logic/productsDynamicPricing.types'

type DynamicPricingInsightsRowProps = {
  insights: DynamicPricingInsight[]
}

export function DynamicPricingInsightsRow({ insights }: DynamicPricingInsightsRowProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {insights.map((insight) => (
        <DynamicPricingInsightCard key={insight.id} insight={insight} />
      ))}
    </section>
  )
}
