import type { Order, OrderStatus } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

export type OrderPlatformFilter = 'all' | PlatformCode
export type OrderStatusFilter = 'all' | 'pending_group' | 'shipping_group' | 'delivered' | 'return_group'

export type OrdersAllQueryState = {
  search: string
  status: OrderStatusFilter
  platform: OrderPlatformFilter
  page: number
  pageSize: number
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}

export type OrdersAllAdvancedFilters = {
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}

export type OrdersSummary = {
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  totalRevenue: number
  platformBreakdown: Record<PlatformCode, number>
  statusBreakdown: {
    pendingGroup: number
    shipping: number
    delivered: number
    returnGroup: number
  }
}

export type OrdersAllResponse = {
  items: Order[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  summary: OrdersSummary
}

export type OrdersAllFiltersModel = {
  search: string
  status: OrderStatusFilter
  platform: OrderPlatformFilter
}

export type OrdersAllPlatformOption = {
  value: OrderPlatformFilter
  label: string
}

export type OrdersAllTableRowModel = {
  id: string
  code: string
  platform: PlatformCode
  platformLabel: string
  buyerName: string
  firstProductName: string
  productCount: number
  totalQuantity: number
  productLabel: string
  status: OrderStatus
  statusLabel: string
  statusShortLabel: string
  printStatus: 'printed' | 'not_printed'
  printStatusLabel: string
  amountValue: number
  amountLabel: string
  updatedAgoLabel: string
  updatedAtMs: number
  updatedTone: 'default' | 'danger'
}

export type OrdersAllViewModel = {
  title: string
  todayLabel: string
  urgentLabel: string
  platformOptions: OrdersAllPlatformOption[]
  filters: OrdersAllFiltersModel
  statusTabs: Array<{
    id: OrderStatusFilter
    label: string
    count: number
  }>
  bulkSelectionLabel: string
  summaryLabel: {
    totalOrders: string
    totalRevenue: string
    pending: string
  }
  rows: OrdersAllTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
}
