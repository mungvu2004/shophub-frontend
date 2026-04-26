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

export type InventoryAIForecastScenarioViewModel = {
  id: string
  label: string
  description: string
  impactLabel: string
  tone: 'indigo' | 'emerald' | 'rose'
}

export type InventoryAIForecastDetailViewModel = {
  title: string
  subtitle: string
  backLabel: string
  skuTitle: string
  productName: string
  tags: string[]
  currentStock: number
  currentStockLabel: string
  avgDailySalesLabel: string
  stockoutDateLabel: string
  suggestedInboundLabel: string
  confidenceScore: number
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
  riskTone: 'low' | 'medium' | 'high'
  scenarios: InventoryAIForecastScenarioViewModel[]
}
