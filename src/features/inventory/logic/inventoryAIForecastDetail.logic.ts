import type { InventoryAIForecastDetailViewModel } from '@/features/inventory/logic/inventoryAIForecastDetail.types'
import type { InventoryAIForecastDetailResponse } from '@/features/inventory/services/inventoryAIForecastService'

const numberFormatter = new Intl.NumberFormat('vi-VN')

const toDateLabel = (isoDate: string) => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return '--/--'
  }

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function buildInventoryAIForecastDetailViewModel(
  payload: InventoryAIForecastDetailResponse,
): InventoryAIForecastDetailViewModel {
  return {
    title: '✨ Dự báo Tồn kho AI',
    subtitle: `Model: ${payload.modelName} · Độ chính xác ${payload.modelAccuracyRate}%`,
    backLabel: 'Quay lại tất cả dự báo',
    skuTitle: `${payload.sku} — ${payload.productName}`,
    tags: [payload.categoryTag, payload.groupTag],
    currentStockLabel: `${numberFormatter.format(payload.currentStock)} units`,
    avgDailySalesLabel: `${payload.avgDailySales.toFixed(1)} /day`,
    stockoutDateLabel: toDateLabel(payload.predictedStockoutDate),
    suggestedInboundLabel: `${numberFormatter.format(payload.suggestedInboundQty)} units`,
    chartTitle: 'Biểu đồ dự báo nhu cầu',
    chartLegend: {
      history: '90 ngày lịch sử',
      forecast: '30 ngày dự báo',
      confidence: 'Khoảng tin cậy',
    },
    chartPoints: payload.chartPoints.map((point) => ({
      monthLabel: point.monthLabel,
      historical: point.historical,
      forecast: point.forecast,
      confidenceRange: [point.confidenceLow, point.confidenceHigh],
    })),
    factorsTitle: 'Yếu tố ảnh hưởng chính',
    factors: payload.factors,
    aiTitle: 'Gợi ý từ AI',
    aiSuggestionText: payload.aiSuggestionText,
    riskLabel: payload.riskLevelText,
  }
}
