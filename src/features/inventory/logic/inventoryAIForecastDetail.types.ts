export type InventoryAIForecastDetailChartPointViewModel = {
  monthLabel: string
  historical: number
  forecast: number
  confidenceRange: [number, number]
}

export type InventoryAIForecastFactorViewModel = {
  id: string
  label: string
  impactPercent: number
}

export type InventoryAIForecastDetailViewModel = {
  title: string
  subtitle: string
  backLabel: string
  skuTitle: string
  tags: string[]
  currentStockLabel: string
  avgDailySalesLabel: string
  stockoutDateLabel: string
  suggestedInboundLabel: string
  chartTitle: string
  chartLegend: {
    history: string
    forecast: string
    confidence: string
  }
  chartPoints: InventoryAIForecastDetailChartPointViewModel[]
  factorsTitle: string
  factors: InventoryAIForecastFactorViewModel[]
  aiTitle: string
  aiSuggestionText: string
  riskLabel: string
}
