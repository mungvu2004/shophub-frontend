import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

export type RevenuePlatformKey = 'shopee' | 'tiktok' | 'lazada'

export type RevenueLineChartPoint = {
  dateKey: string
  label: string
  shopee: number
  tiktok: number
  lazada: number
}

export type RevenueLineChartLegendItem = {
  key: RevenuePlatformKey
  label: string
  color: string
}

export type RevenueLineChartViewModel = {
  title: string
  subtitle: string
  points: RevenueLineChartPoint[]
  legend: RevenueLineChartLegendItem[]
  hasData: boolean
}

export type RevenueLineChartModelParams = {
  orders?: RevenueOrderItem[]
  days?: number
  now?: Date
}
