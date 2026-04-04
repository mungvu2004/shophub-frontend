import { apiClient } from '@/services/apiClient'

export type InventoryForecastAction = 'URGENT_RESTOCK' | 'PLAN_RESTOCK' | 'HEALTHY'

export type InventoryAIForecastModel = {
  name: string
  updatedAt: string
  accuracyRate: number
  inputSkuCount: number
  historyDays: number
  lastRunAt: string
  statusText: string
}

export type InventoryAIForecastUrgentItem = {
  id: string
  productName: string
  sku: string
  confidencePercent: number
  currentStock: number
  stockoutDays: number
  stockoutDate: string
  suggestedInboundQty: number
  reasons: string[]
  fillRatePercent: number
}

export type InventoryAIForecastWatchItem = {
  id: string
  productName: string
  sku: string
  currentStock: number
  predictedStockoutDays: number
  predictedInboundQty: number
  confidencePercent: number
}

export type InventoryAIForecastTableRow = {
  id: string
  sku: string
  productName: string
  currentStock: number
  avgDailySales: number
  forecastDays: number
  suggestedInboundQty: number
  confidencePercent: number
  action: InventoryForecastAction
}

export type InventoryAIForecastResponse = {
  model: InventoryAIForecastModel
  urgentRestocks: InventoryAIForecastUrgentItem[]
  watchlist: InventoryAIForecastWatchItem[]
  allForecastRows: InventoryAIForecastTableRow[]
  generatedAt: string
}

export type InventoryAIForecastFactor = {
  id: string
  label: string
  impactPercent: number
}

export type InventoryAIForecastChartPoint = {
  monthLabel: string
  historical: number
  forecast: number
  confidenceLow: number
  confidenceHigh: number
}

export type InventoryAIForecastDetailResponse = {
  sku: string
  productName: string
  categoryTag: string
  groupTag: string
  currentStock: number
  avgDailySales: number
  predictedStockoutDate: string
  suggestedInboundQty: number
  modelName: string
  modelAccuracyRate: number
  chartPoints: InventoryAIForecastChartPoint[]
  factors: InventoryAIForecastFactor[]
  aiSuggestionText: string
  riskLevelText: string
}

class InventoryAIForecastService {
  async getForecast(): Promise<InventoryAIForecastResponse> {
    try {
      const response = await apiClient.get('/inventory/ai-forecast')
      return response.data as InventoryAIForecastResponse
    } catch {
      const fallbackResponse = await apiClient.get('/api/inventory/ai-forecast')
      return fallbackResponse.data as InventoryAIForecastResponse
    }
  }

  async getForecastDetail(sku: string): Promise<InventoryAIForecastDetailResponse> {
    const safeSku = encodeURIComponent(sku)

    try {
      const response = await apiClient.get(`/inventory/ai-forecast/detail/${safeSku}`)
      return response.data as InventoryAIForecastDetailResponse
    } catch {
      const fallbackResponse = await apiClient.get(`/api/inventory/ai-forecast/detail/${safeSku}`)
      return fallbackResponse.data as InventoryAIForecastDetailResponse
    }
  }
}

export const inventoryAIForecastService = new InventoryAIForecastService()
