import type { RevenuePlatformComparisonViewModel } from '@/features/revenue/logic/revenuePlatformComparison.logic'
import {
  RevenueComparisonCards,
  RevenueComparisonHeader,
  RevenueComparisonInsights,
  RevenueComparisonKpiAndTrend,
} from '@/features/revenue/components/revenue-platform-comparison/RevenuePlatformComparisonSections'

type PlatformActions = {
  isProcessing: boolean
  isSyncing: boolean
  isExporting: boolean
  handleSync: (month: string) => Promise<void>
  handleExport: () => Promise<void>
  messages: {
    sync: string
    syncLoading: string
    export: string
    exportLoading: string
  }
}

type RevenuePlatformComparisonViewProps = {
  model: RevenuePlatformComparisonViewModel
  platformActions: PlatformActions
  selectedMonth: string
}

export function RevenuePlatformComparisonView({ model, platformActions, selectedMonth }: RevenuePlatformComparisonViewProps) {
  return (
    <div className="space-y-6">
      <RevenueComparisonHeader 
        title={model.title} 
        subtitle={model.subtitle} 
        monthLabel={model.monthLabel}
        platformActions={platformActions}
        selectedMonth={selectedMonth}
      />
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
