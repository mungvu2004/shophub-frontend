import { useMemo } from 'react'

import { buildAIInsightsColumnViewModel, buildAIInsightsFromAlerts } from '@/features/dashboard/logic/aiInsightsColumn.logic'
import type { InventoryAlertItem } from '@/features/dashboard/services/dashboardService'

import { AIInsightsColumnView } from './AIInsightsColumnView'

type AIInsightsColumnProps = {
  alerts?: InventoryAlertItem[]
}

export function AIInsightsColumn({ alerts }: AIInsightsColumnProps) {
  const model = useMemo(() => {
    const insightItems = buildAIInsightsFromAlerts({ alerts })
    return buildAIInsightsColumnViewModel(insightItems)
  }, [alerts])

  return <AIInsightsColumnView model={model} />
}
