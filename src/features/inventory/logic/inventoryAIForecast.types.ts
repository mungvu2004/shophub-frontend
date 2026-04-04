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
}
