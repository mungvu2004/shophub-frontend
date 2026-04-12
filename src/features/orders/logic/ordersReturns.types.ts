import type { PlatformCode } from '@/types/platform.types'

export type OrdersReturnsViewMode = 'table' | 'timeline'
export type OrdersReturnsPlatformFilter = 'all' | PlatformCode

export type OrdersReturnsStatus = 'processing' | 'cancelled' | 'awaiting_pickup' | 'refunded'
export type OrdersReturnsKind = 'return' | 'cancel'

export type OrdersReturnsQueryState = {
  search: string
  platform: OrdersReturnsPlatformFilter
  page: number
  pageSize: number
}

export type OrdersReturnsSummary = {
  totalReturns: number
  totalCancellations: number
  impactedRevenue: number
  returnsDeltaPercent: number
  cancellationsDeltaPercent: number
  platformBreakdown: Record<PlatformCode, number>
}

export type OrdersReturnsItem = {
  id: string
  orderCode: string
  orderKind: OrdersReturnsKind
  platform: PlatformCode
  productName: string
  customerName: string
  amount: number
  status: OrdersReturnsStatus
  happenedAt: string
}

export type OrdersReturnsResponse = {
  items: OrdersReturnsItem[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  summary: OrdersReturnsSummary
}

export type OrdersReturnsStatCardModel = {
  id: 'returns' | 'cancellations' | 'revenue'
  title: string
  valueLabel: string
  subLabel: string
  tone: 'rose' | 'slate' | 'indigo'
}

export type OrdersReturnsTimelineItemModel = {
  id: string
  orderCode: string
  orderKindLabel: string
  orderKindTone: 'rose' | 'slate'
  platformLabel: string
  platformDotClass: string
  productName: string
  customerName: string
  amountLabel: string
  statusLabel: string
  statusClassName: string
  isAlert: boolean
}

export type OrdersReturnsDateGroupModel = {
  dateLabel: string
  items: OrdersReturnsTimelineItemModel[]
}

export type OrdersReturnsTableRowModel = OrdersReturnsTimelineItemModel & {
  timeLabel: string
}

export type OrdersReturnsViewModel = {
  title: string
  subtitleLabel: string
  dateRangeLabel: string
  statCards: OrdersReturnsStatCardModel[]
  tableRows: OrdersReturnsTableRowModel[]
  timelineGroups: OrdersReturnsDateGroupModel[]
  totalCount: number
  page: number
  pageSize: number
  platformOptions: Array<{ value: OrdersReturnsPlatformFilter; label: string }>
  filters: {
    search: string
    platform: OrdersReturnsPlatformFilter
  }
}
