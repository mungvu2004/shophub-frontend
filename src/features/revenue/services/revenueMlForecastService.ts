import { apiClient } from '@/services/apiClient'
import type { RevenueMlForecastRangeDays, RevenueMlForecastResponse } from '@/types/revenue.types'

class RevenueMlForecastService {
  async getForecast(days: RevenueMlForecastRangeDays): Promise<RevenueMlForecastResponse> {
    const response = await apiClient.get('/revenue/ml-forecast', {
      params: {
        days,
      },
    })

    // Mock additional fields if not provided by backend
    const data = response.data
    if (!data.targetRevenue) {
      data.targetRevenue = 65_000_000
    }
    if (!data.gapToTarget) {
      data.gapToTarget = Math.max(0, data.targetRevenue - data.cards[0]?.predictionValue)
    }
    if (!data.channelBreakdown) {
      data.channelBreakdown = [
        { channel: 'Shopee', percentage: 45, revenue: (data.cards[0]?.predictionValue || 58_200_000) * 0.45, colorHex: '#EE1D52' },
        { channel: 'TikTok Shop', percentage: 30, revenue: (data.cards[0]?.predictionValue || 58_200_000) * 0.3, colorHex: '#000000' },
        { channel: 'Lazada', percentage: 20, revenue: (data.cards[0]?.predictionValue || 58_200_000) * 0.2, colorHex: '#0066FF' },
        { channel: 'Website', percentage: 5, revenue: (data.cards[0]?.predictionValue || 58_200_000) * 0.05, colorHex: '#3525CD' },
      ]
    }
    if (!data.historicalMape) {
      data.historicalMape = 3.5
    }
    if (!data.keyDrivers) {
      data.keyDrivers = [
        { id: 'holiday', label: 'Hiệu ứng ngày lễ', impact: 15, trend: 'positive' },
        { id: 'search-trend', label: 'Xu hướng tìm kiếm sản phẩm A tăng', impact: 10, trend: 'positive' },
        { id: 'competitor', label: 'Đối thủ giảm giá mạnh', impact: -5, trend: 'negative' },
      ]
    }

    return data
  }
}

export const revenueMlForecastService = new RevenueMlForecastService()
