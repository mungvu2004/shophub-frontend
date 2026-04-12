import type { PlatformCode } from '@/types/platform.types'

export type OrdersPendingActionsPlatformFilter = 'all' | PlatformCode
export type OrdersPendingActionsSlaFilter = 'all' | 'critical' | 'warning' | 'safe'

export type OrdersPendingActionSlaLevel = 'critical' | 'warning' | 'safe'

export type OrdersPendingActionItem = {
  id: string
  orderCode: string
  platform: PlatformCode
  customerName: string
  productName: string
  amount: number
  status: string
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
  platformLabel: string
  platformDotClass: string
  customerName: string
  productName: string
  amountLabel: string
  statusLabel: string
  waitingLabel: string
  waitingClassName: string
  actionLabel: string
  actionClassName: string
  updatedAtLabel: string
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
