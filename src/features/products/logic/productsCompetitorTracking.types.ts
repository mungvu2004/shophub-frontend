export type CompetitorPlatform = 'shopee' | 'tiktok_shop' | 'lazada'

export type PriceTrend = 'up' | 'down' | 'stable'

export interface CompetitorPriceRow {
  id: string
  productId: string
  productName: string
  yourPrice: number
  marketAveragePrice: number
  lowestMarketPrice: number
  rank: number
  totalCompetitors: number
  trend: PriceTrend
  platform: CompetitorPlatform
}

export interface TopCompetitor {
  id: string
  shopName: string
  platform: CompetitorPlatform
  score: number
  productCount: number
  lastUpdatedHours: number
}

export interface PriceAlertSettings {
  thresholdPercent: number
  updatedAt: string
}

export interface PriceHeatmapBucket {
  rangeLabel: string
  totalCompetitors: number
}

export interface PriceHeatmapRow {
  category: string
  buckets: PriceHeatmapBucket[]
}

export interface CompetitorAlertBanner {
  matchedCount: number
  message: string
}

export interface CompetitorTrackingPayload {
  alertBanner: CompetitorAlertBanner
  totalProductsTracked: number
  comparisonRows: CompetitorPriceRow[]
  topCompetitors: TopCompetitor[]
  alertSettings: PriceAlertSettings
  heatmap: PriceHeatmapRow[]
}

export interface CompetitorTrackingViewModel {
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  alertBanner: CompetitorAlertBanner
  totalProductsTracked: number
  filteredRows: CompetitorPriceRow[]
  topCompetitors: TopCompetitor[]
  alertSettings: PriceAlertSettings
  heatmap: PriceHeatmapRow[]
  searchValue: string
  thresholdPercentInput: string
  onSearchChange: (value: string) => void
  onThresholdChange: (value: string) => void
  onOpenProductDetail: (productId: string) => void
  onRefresh: () => void
}
