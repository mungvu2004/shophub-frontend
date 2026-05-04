import type { PlatformCode } from '@/types/platform.types'
import type { OrderStatus } from '@/types/order.types'

export type OrdersPendingActionsPlatformFilter = 'all' | PlatformCode
export type OrdersPendingActionsSlaFilter = 'all' | 'critical' | 'warning' | 'safe'

export type OrdersPendingActionSlaLevel = 'critical' | 'warning' | 'safe'

export type OrdersPendingActionItem = {
  id: string
  orderCode: string
  platform: PlatformCode
  customerName: string
  productName: string
  sku: string
  variantLabel: string
  quantity: number
  thumbnailUrl: string
  customerNote?: string
  amount: number
  status: OrderStatus
  printStatus: 'printed' | 'not_printed'
  waitingMinutes: number
  slaLevel: OrdersPendingActionSlaLevel
  recommendedAction: string
  updatedAt: string
}

export type OrdersPendingActionsSummary = {
  totalPending: number
  criticalCount: number
  warningCount: number
  avgWaitingMinutes: number
  platformBreakdown: Record<PlatformCode, number>
}

export type OrdersPendingActionsResponse = {
  items: OrdersPendingActionItem[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  summary: OrdersPendingActionsSummary
}

export type OrdersPendingActionsQuery = {
  search: string
  platform: OrdersPendingActionsPlatformFilter
  sla: OrdersPendingActionsSlaFilter
  page: number
  pageSize: number
  dateFrom: string
  dateTo: string
}

export type OrdersPendingActionsDateFilters = {
  dateFrom: string
  dateTo: string
}

export type OrdersPendingActionsPlatformOption = {
  value: OrdersPendingActionsPlatformFilter
  label: string
}

export type OrdersPendingActionsSlaOption = {
  value: OrdersPendingActionsSlaFilter
  label: string
}

export type OrdersPendingActionsCardModel = {
  id: string
  title: string
  value: string
  hint: string
  tone: 'indigo' | 'rose' | 'amber' | 'slate'
}

export type OrdersPendingActionsTableRowModel = {
  id: string
  orderCode: string
  platform: PlatformCode
  platformLabel: string
  platformMarkText: string
  platformMarkClass: string
  customerName: string
  hasCustomerNote: boolean
  customerNoteText: string
  productName: string
  productSku: string
  productVariantLabel: string
  productQuantity: number
  productThumbnailUrl: string
  amountLabel: string
  amountValue: number
  status: OrderStatus
  statusLabel: string
  statusBadgeClassName: string
  printStatus: 'printed' | 'not_printed'
  printStatusLabel: string
  waitingLabel: string
  waitingMinutes: number
  waitingClassName: string
  actionLabel: string
  actionClassName: string
  updatedAtLabel: string
  updatedAtMs: number
}

export type OrdersPendingActionsViewModel = {
  heading: string
  description: string
  search: string
  platform: OrdersPendingActionsPlatformFilter
  sla: OrdersPendingActionsSlaFilter
  page: number
  pageSize: number
  totalCount: number
  platformOptions: OrdersPendingActionsPlatformOption[]
  slaOptions: OrdersPendingActionsSlaOption[]
  cards: OrdersPendingActionsCardModel[]
  rows: OrdersPendingActionsTableRowModel[]
}
