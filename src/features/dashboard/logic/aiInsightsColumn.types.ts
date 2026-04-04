import type { InventoryAlertItem } from '@/features/dashboard/services/dashboardService'

export type AIInsightTone = 'critical' | 'warning' | 'low'

export type AIInsightItem = {
  id: string
  tag: string
  productName: string
  remainingUnits: number
  tone: AIInsightTone
}

export type AIInsightsColumnViewModel = {
  title: string
  badgeLabel: string
  items: AIInsightItem[]
  ctaLabel: string
  hasData: boolean
}

export type BuildAIInsightsFromAlertsParams = {
  alerts?: InventoryAlertItem[]
}
