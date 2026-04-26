export type ForecastTableFilter = 'all' | 'urgent' | 'warning' | 'healthy'

export type InventoryAIForecastUrgentCardViewModel = {
  id: string
  productName: string
  sku: string
  confidenceLabel: string
  currentStockLabel: string
  stockoutLabel: string
  suggestedInboundLabel: string
  reasons: string[]
  fillRateLabel: string
}

export type InventoryAIForecastWatchCardViewModel = {
  id: string
  productName: string
  sku: string
  currentStockLabel: string
  forecastLabel: string
  suggestedInboundLabel: string
  confidenceLabel: string
}

export type InventoryAIForecastTableRowViewModel = {
  id: string
  sku: string
  productName: string
  currentStockLabel: string
  avgDailySalesLabel: string
  forecastLabel: string
  suggestedInboundLabel: string
  confidenceLabel: string
  status: Exclude<ForecastTableFilter, 'all'>
}

export type InventoryAIForecastTableTabViewModel = {
  id: ForecastTableFilter
  label: string
  count: number
}

// New Types for Craft Proposals
export type ForecastAccuracyViewModel = {
  mape: number
  rmse: number
  previousMape: number
  status: 'improved' | 'declined' | 'stable'
  lastPeriodLabel: string
}

export type SeasonalityPatternViewModel = {
  id: string
  name: string
  impactLabel: string
  description: string
  confidencePercent: number
  periodLabel: string
}

export type InboundPlanItemViewModel = {
  id: string
  sku: string
  productName: string
  suggestedQuantity: number
  suggestedOrderDate: string
  suggestedOrderDateLabel: string
  leadTimeDays: number
  priority: 'high' | 'medium' | 'low'
}

export type InventoryAIForecastViewModel = {
  title: string
  modelDescription: string
  modelAccuracyLabel: string
  modelInputLabel: string
  modelRunLabel: string
  modelStatusText: string
  urgentTitle: string
  watchTitle: string
  totalRowsLabel: string
  generatedAtLabel: string
  urgentCards: InventoryAIForecastUrgentCardViewModel[]
  watchCards: InventoryAIForecastWatchCardViewModel[]
  tableRows: InventoryAIForecastTableRowViewModel[]
  tabs: InventoryAIForecastTableTabViewModel[]
  
  // Added for new features
  accuracy: ForecastAccuracyViewModel
  seasonalityPatterns: SeasonalityPatternViewModel[]
  inboundPlan: InboundPlanItemViewModel[]
}

export type ForecastParameterInput = {
  eventId: string
  eventName: string
  startDate: string
  endDate: string
  expectedTrafficMultiplier: number
  expectedSalesBoost: number
}
