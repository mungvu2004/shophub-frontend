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
    title: '✨ Dự báo Tồn kho thông minh',
    subtitle: `Phân tích dựa trên mô hình ${payload.modelName} · Dữ liệu cập nhật lúc ${new Date().getHours()}:00`,
    backLabel: 'Quay lại danh sách dự báo',
    skuTitle: payload.sku,
    productName: payload.productName,
    tags: [payload.categoryTag, payload.groupTag, 'High Demand'],
    currentStock: payload.currentStock,
    currentStockLabel: `${numberFormatter.format(payload.currentStock)} chiếc`,
    avgDailySalesLabel: `${payload.avgDailySales.toFixed(1)} đơn/ngày`,
    stockoutDateLabel: toDateLabel(payload.predictedStockoutDate),
    suggestedInboundLabel: `${numberFormatter.format(payload.suggestedInboundQty)} chiếc`,
    confidenceScore: payload.modelAccuracyRate,
    chartTitle: 'Dự báo nhu cầu thị trường',
    chartLegend: {
      history: 'Thực tế bán',
      forecast: 'Dự báo AI',
      confidence: 'Vùng tin cậy 95%',
    },
    chartPoints: payload.chartPoints.map((point) => ({
      monthLabel: point.monthLabel,
      historical: point.historical,
      forecast: point.forecast,
      confidenceRange: [point.confidenceLow, point.confidenceHigh],
    })),
    factorsTitle: 'Các nhân tố tác động',
    factors: payload.factors.map(f => ({ ...f, impactPercent: f.impactPercent * 1.2 })), // Scale for visual
    aiTitle: 'AI INSIGHTS & GỢI Ý',
    aiSuggestionText: payload.aiSuggestionText,
    riskLabel: payload.riskLevelText,
    riskTone: payload.riskLevelText.includes('Cao') ? 'high' : payload.riskLevelText.includes('Trung') ? 'medium' : 'low',
    scenarios: [
      {
        id: '1',
        label: 'Tăng trưởng nóng',
        description: 'Nếu triển khai chiến dịch KOL vào tháng tới',
        impactLabel: '+35% Nhu cầu',
        tone: 'emerald'
      },
      {
        id: '2',
        label: 'Đứt gãy cung ứng',
        description: 'Thời gian vận chuyển quốc tế tăng thêm 7 ngày',
        impactLabel: 'Nguy cơ Stockout',
        tone: 'rose'
      },
      {
        id: '3',
        label: 'Tối ưu vốn',
        description: 'Giảm 15% tồn kho đệm để giải phóng dòng tiền',
        impactLabel: '-15% Chi phí lưu kho',
        tone: 'indigo'
      }
    ]
  }
}
