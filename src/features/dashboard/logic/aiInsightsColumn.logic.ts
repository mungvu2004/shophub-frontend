import type { BuildAIInsightsFromAlertsParams, AIInsightItem, AIInsightsColumnViewModel } from '@/features/dashboard/logic/aiInsightsColumn.types'

const severityOrder = { critical: 0, warning: 1, info: 2 } as const

function mapTone(alertType?: string, severity?: string): AIInsightItem['tone'] {
  const normalizedAlertType = alertType?.toLowerCase()
  const normalizedSeverity = severity?.toLowerCase()

  if (normalizedAlertType === 'out_of_stock' || normalizedSeverity === 'critical') return 'critical'
  if (normalizedAlertType === 'low_stock' || normalizedSeverity === 'warning') return 'warning'

  return 'low'
}

function mapTag(tone: AIInsightItem['tone']): string {
  if (tone === 'critical') return 'SẮP HẾT HÀNG'
  if (tone === 'warning') return 'CẦN NHẬP THÊM'
  return 'TỒN KHO THẤP'
}

export function buildAIInsightsFromAlerts({ alerts = [] }: BuildAIInsightsFromAlertsParams): AIInsightItem[] {
  const activeAlerts = alerts.filter((alert) => !alert.isResolved)

  return activeAlerts
    .sort((a, b) => {
      const aSeverity = (a.severity?.toLowerCase() ?? 'info') as keyof typeof severityOrder
      const bSeverity = (b.severity?.toLowerCase() ?? 'info') as keyof typeof severityOrder

      return (severityOrder[aSeverity] ?? 2) - (severityOrder[bSeverity] ?? 2)
    })
    .slice(0, 3)
    .map((alert, index) => {
      const tone = mapTone(alert.alertType, alert.severity)

      return {
        id: alert.id ?? `alert-${index + 1}`,
        tag: mapTag(tone),
        productName: alert.productName ?? 'Sản phẩm chưa đặt tên',
        remainingUnits: Math.max(0, Number(alert.currentAvailableQty ?? 0)),
        tone,
      }
    })
}

export function buildAIInsightsColumnViewModel(items: AIInsightItem[]): AIInsightsColumnViewModel {
  return {
    title: 'Cảnh báo Tồn kho',
    badgeLabel: 'AI INSIGHT',
    items,
    ctaLabel: 'TỰ ĐỘNG TẠO PHIẾU NHẬP HÀNG',
    hasData: items.length > 0,
  }
}
