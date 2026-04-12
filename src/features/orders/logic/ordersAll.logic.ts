import type { Order, OrderStatus } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

import type {
  OrderPlatformFilter,
  OrderStatusFilter,
  OrdersAllQueryState,
  OrdersAllPlatformOption,
  OrdersAllResponse,
  OrdersAllTableRowModel,
  OrdersAllViewModel,
} from '@/features/orders/logic/ordersAll.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')
const currencyFormatter = new Intl.NumberFormat('vi-VN')

const platformLabelMap: Record<PlatformCode, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok',
}

export const ORDERS_ALL_PLATFORM_OPTIONS: OrdersAllPlatformOption[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiktok_shop', label: 'TikTok' },
]

const statusLabelMap: Record<OrderStatus, string> = {
  Pending: 'Chờ xác nhận',
  PendingPayment: 'Chờ thanh toán',
  Confirmed: 'Chờ xác nhận',
  Packed: 'Chờ xác nhận',
  ReadyToShip: 'Chờ xác nhận',
  Shipped: 'Đang giao',
  Delivered: 'Đã giao',
  FailedDelivery: 'Giao thất bại',
  Cancelled: 'Đã hủy',
  Returned: 'Trả hàng',
  Refunded: 'Hoàn tiền',
  Lost: 'Thất lạc',
}

const statusShortLabelMap: Record<OrderStatus, string> = {
  Pending: 'CCN XT LÝ',
  PendingPayment: 'CCN XT LÝ',
  Confirmed: 'CHỜ XÁC NHẬN',
  Packed: 'CHỜ XÁC NHẬN',
  ReadyToShip: 'CHỜ XÁC NHẬN',
  Shipped: 'ĐANG GIAO',
  Delivered: 'ĐÃ GIAO',
  FailedDelivery: 'TRG HẠN',
  Cancelled: 'TRG HẠN',
  Returned: 'TRG HẠN',
  Refunded: 'TRG HẠN',
  Lost: 'TRG HẠN',
}

function formatCurrency(value: number) {
  return `${currencyFormatter.format(Math.max(0, Math.round(value)))} ₫`
}

function formatAgo(value: string) {
  const time = new Date(value)
  if (Number.isNaN(time.getTime())) return '--'

  const diffMs = Date.now() - time.getTime()
  const diffMin = Math.max(0, Math.floor(diffMs / (1000 * 60)))

  if (diffMin < 60) return `${diffMin} phút trước`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} giờ trước`

  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} ngày trước`
}

function toStatusTabs(response: OrdersAllResponse): Array<{ id: OrderStatusFilter; label: string; count: number }> {
  return [
    { id: 'all', label: 'Tất cả đơn', count: response.summary.totalOrders },
    { id: 'pending_group', label: 'Chờ xác nhận', count: response.summary.statusBreakdown.pendingGroup },
    { id: 'shipping_group', label: 'Đang giao', count: response.summary.statusBreakdown.shipping },
    { id: 'delivered', label: 'Đã giao', count: response.summary.statusBreakdown.delivered },
    { id: 'return_group', label: 'Hoàn/Huỷ', count: response.summary.statusBreakdown.returnGroup },
  ]
}

function resolvePlatformOptions(selectedPlatform: OrderPlatformFilter): OrdersAllPlatformOption[] {
  const hasLazada = ORDERS_ALL_PLATFORM_OPTIONS.some((item) => item.value === 'lazada')

  if (hasLazada) {
    return ORDERS_ALL_PLATFORM_OPTIONS
  }

  return selectedPlatform === 'lazada'
    ? [...ORDERS_ALL_PLATFORM_OPTIONS, { value: 'lazada', label: 'Lazada' }]
    : ORDERS_ALL_PLATFORM_OPTIONS
}

function toBuyerName(order: Order) {
  const fullName = `${order.buyerFirstName ?? ''} ${order.buyerLastName ?? ''}`.trim()
  if (fullName) return fullName
  return '--'
}

function toRows(items: Order[]): OrdersAllTableRowModel[] {
  return items.map((order) => ({
    id: order.id,
    code: order.externalOrderNumber || order.externalOrderId || order.id,
    platform: order.platform,
    platformLabel: platformLabelMap[order.platform],
    buyerName: toBuyerName(order),
    productLabel: order.items?.[0]?.productName || `${order.items?.length ?? 0} sản phẩm`,
    status: order.status,
    statusLabel: statusLabelMap[order.status],
    statusShortLabel: statusShortLabelMap[order.status],
    amountLabel: formatCurrency(order.totalAmount),
    updatedAgoLabel: formatAgo(order.updatedAt_platform || order.updatedAt || order.createdAt_platform || order.createdAt),
    updatedTone: order.status === 'Cancelled' || order.status === 'FailedDelivery' ? 'danger' : 'default',
  }))
}

export function getStatusTone(status: OrderStatus): 'amber' | 'blue' | 'emerald' | 'rose' | 'slate' {
  if (status === 'Pending' || status === 'PendingPayment' || status === 'ReadyToShip') return 'amber'
  if (status === 'Confirmed' || status === 'Packed' || status === 'Shipped') return 'blue'
  if (status === 'Delivered') return 'emerald'
  if (status === 'Cancelled' || status === 'FailedDelivery' || status === 'Returned' || status === 'Refunded' || status === 'Lost') return 'rose'
  return 'slate'
}

export function buildOrdersAllViewModel(args: {
  response: OrdersAllResponse
  query: OrdersAllQueryState
  selectedCount: number
}): OrdersAllViewModel {
  const { response, query, selectedCount } = args

  return {
    title: 'Quản lý Đơn hàng',
    todayLabel: `${numberFormatter.format(response.summary.totalOrders)} đơn hôm nay`,
    urgentLabel: `${numberFormatter.format(response.summary.pendingOrders)} cần xử lý ngay`,
    platformOptions: resolvePlatformOptions(query.platform),
    filters: {
      search: query.search,
      status: query.status,
      platform: query.platform,
    },
    statusTabs: toStatusTabs(response),
    bulkSelectionLabel: `${selectedCount} đơn đã chọn`,
    summaryLabel: {
      totalOrders: `${numberFormatter.format(response.summary.totalOrders)} đơn`,
      totalRevenue: formatCurrency(response.summary.totalRevenue),
      pending: numberFormatter.format(response.summary.pendingOrders),
    },
    rows: toRows(response.items),
    totalCount: response.totalCount,
    page: query.page,
    pageSize: query.pageSize,
  }
}
