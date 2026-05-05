import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

export type TopProductPlatform = 'shopee' | 'tiktok' | 'lazada'

export type TopProductTableInputItem = {
  id: string
  productId?: string
  name: string
  platform: TopProductPlatform
  soldInMonth: number
  revenue: number
  imageUrl?: string
}

export type TopProductTableRow = {
  id: string
  productId?: string
  rank: string
  name: string
  platform: TopProductPlatform
  soldInMonthLabel: string
  revenueLabel: string
  imageUrl?: string
}

export type TopProductsTableViewModel = {
  title: string
  ctaLabel: string
  rows: TopProductTableRow[]
  hasData: boolean
}

export type TopProductsTableModelParams = {
  products?: TopProductTableInputItem[]
}

export type BuildTopProductsFromOrdersParams = {
  orders?: RevenueOrderItem[]
}
