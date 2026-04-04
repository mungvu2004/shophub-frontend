import type { RevenuePlatformComparisonViewModel } from '@/features/revenue/logic/revenuePlatformComparison.logic'
import {
  RevenueComparisonCards,
  RevenueComparisonHeader,
  RevenueComparisonInsights,
  RevenueComparisonKpiAndTrend,
} from '@/features/revenue/components/revenue-platform-comparison/RevenuePlatformComparisonSections'

type RevenuePlatformComparisonViewProps = {
  model: RevenuePlatformComparisonViewModel
}

export function RevenuePlatformComparisonView({ model }: RevenuePlatformComparisonViewProps) {
  return (
    <div className="space-y-6">
      <RevenueComparisonHeader title={model.title} subtitle={model.subtitle} monthLabel={model.monthLabel} />
      <RevenueComparisonCards cards={model.cards} />
      <RevenueComparisonKpiAndTrend model={model} />
      <RevenueComparisonInsights
        title={model.insightsTitle}
        subtitle={model.insightsSubtitle}
        items={model.insights}
      />
    </div>
  )
}
