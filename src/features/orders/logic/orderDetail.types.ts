import type { Order, OrderStatus } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

export type OrderDetailTab = 'detail' | 'history' | 'review'

export type OrderDetailHistoryItem = {
  id: string
  title: string
  happenedAtLabel: string
  note?: string
  done: boolean
  active?: boolean
}

export type OrderDetailReviewItem = {
  id: string
  sourceLabel: string
  rating: number
  content: string
  createdAtLabel: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

export type OrderDetailViewData = {
  orderId: string
  orderCode: string
  suggestedActionLabel?: string
  platform: PlatformCode
  platformLabel: string
  customerName: string
  phone: string
  address: string
  productName: string
  quantity: number
  statusLabel: string
  createdAtLabel: string
  updatedAtLabel: string
  subtotalLabel: string
  shippingLabel: string
  voucherLabel: string
  totalLabel: string
  history: OrderDetailHistoryItem[]
  reviews: OrderDetailReviewItem[]
}

export type OrderDetailLocationState = {
  orderCode?: string
  platformLabel?: string
  customerName?: string
  productName?: string
  amountLabel?: string
  statusLabel?: string
  actionLabel?: string
}

export type OrderDetailResponse = {
  order?: Order
  view: OrderDetailViewData
}

export type OrderDetailStatusTone = 'success' | 'processing' | 'danger' | 'neutral'

export type OrderDetailViewModel = {
  title: string
  orderCode: string
  platformLabel: string
  platformClassName: string
  statusMessage: string
  statusTone: OrderDetailStatusTone
  quickActions: Array<{
    id: string
    label: string
    tone: 'primary' | 'danger' | 'neutral'
  }>
  tabs: Array<{ id: OrderDetailTab; label: string }>
  view: OrderDetailViewData
}

export type GetOrderDetailParams = {
  id: string
  fallbackState?: OrderDetailLocationState | null
}

export type OrderStatusInfo = {
  label: string
  message: string
  tone: OrderDetailStatusTone
}

export type NullableOrderStatus = OrderStatus | string
