import type { PlatformCode } from '@/types/platform.types'

import type {
  OrdersReturnsDateGroupModel,
  OrdersReturnsItem,
  OrdersReturnsPlatformFilter,
  OrdersReturnsQueryState,
  OrdersReturnsResponse,
  OrdersReturnsStatus,
  OrdersReturnsSummary,
  OrdersReturnsTableRowModel,
  OrdersReturnsTimelineItemModel,
  OrdersReturnsViewModel,
} from '@/features/orders/logic/ordersReturns.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const platformLabelMap: Record<PlatformCode, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok Shop',
}

const platformDotClassMap: Record<PlatformCode, string> = {
  shopee: 'bg-orange-500',
  lazada: 'bg-blue-600',
  tiktok_shop: 'bg-black',
}

const statusLabelMap: Record<OrdersReturnsStatus, string> = {
  processing: 'ĐANG XỬ LÝ',
  cancelled: 'ĐÃ HUỶ',
  awaiting_pickup: 'CHỜ NHẬN HÀNG',
  refunded: 'ĐÃ HOÀN TIỀN',
}

const statusClassMap: Record<OrdersReturnsStatus, string> = {
  processing: 'bg-[#e7eeff] text-indigo-600',
  cancelled: 'bg-[#f0f3ff] text-[#777587]',
  awaiting_pickup: 'bg-[#fff4e5] text-[#f59e0b]',
  refunded: 'bg-[#e8faf3] text-[#059669]',
}

export const ORDERS_RETURNS_PLATFORM_OPTIONS: Array<{ value: OrdersReturnsPlatformFilter; label: string }> = [
  { value: 'all', label: 'Tất cả sàn' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
]

function formatCurrency(value: number) {
  return `${numberFormatter.format(Math.max(0, Math.round(value)))} ₫`
}

function formatDateLabel(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '--/--/----'
  return dateFormatter.format(date)
}

function getMonthSummaryLabel(summary: OrdersReturnsSummary) {
  return `Tháng 3/2026: ${numberFormatter.format(summary.totalReturns)} đơn hoàn · ${numberFormatter.format(summary.totalCancellations)} đơn huỷ`
}

function toTimelineItem(item: OrdersReturnsItem): OrdersReturnsTimelineItemModel {
  return {
    id: item.id,
    orderCode: item.orderCode,
    orderKindLabel: item.orderKind === 'return' ? 'RETURN' : 'CANCEL',
    orderKindTone: item.orderKind === 'return' ? 'rose' : 'slate',
    platformLabel: platformLabelMap[item.platform],
    platformDotClass: platformDotClassMap[item.platform],
    productName: item.productName,
    customerName: item.customerName,
    amountLabel: formatCurrency(item.amount),
    statusLabel: statusLabelMap[item.status],
    statusClassName: statusClassMap[item.status],
    isAlert: item.orderKind === 'return',
  }
}

function toTableRows(items: OrdersReturnsItem[]): OrdersReturnsTableRowModel[] {
  return items.map((item) => {
    const happened = new Date(item.happenedAt)
    const timeLabel = Number.isNaN(happened.getTime())
      ? '--:--'
      : `${String(happened.getHours()).padStart(2, '0')}:${String(happened.getMinutes()).padStart(2, '0')}`

    return {
      ...toTimelineItem(item),
      timeLabel,
    }
  })
}

function toTimelineGroups(items: OrdersReturnsItem[]): OrdersReturnsDateGroupModel[] {
  const groups = new Map<string, OrdersReturnsItem[]>()

  items.forEach((item) => {
    const key = formatDateLabel(item.happenedAt)
    const current = groups.get(key)
    if (current) {
      current.push(item)
      return
    }
    groups.set(key, [item])
  })

  return Array.from(groups.entries()).map(([dateLabel, dateItems]) => ({
    dateLabel,
    items: dateItems.map(toTimelineItem),
  }))
}

export function buildOrdersReturnsViewModel(args: {
  response: OrdersReturnsResponse
  query: OrdersReturnsQueryState
}): OrdersReturnsViewModel {
  const { response, query } = args

  return {
    title: 'Hoàn / Huỷ Đơn hàng',
    subtitleLabel: getMonthSummaryLabel(response.summary),
    dateRangeLabel: '01/03 - 20/03/2026',
    statCards: [
      {
        id: 'returns',
        title: 'Total Returns',
        valueLabel: numberFormatter.format(response.summary.totalReturns),
        subLabel: `${response.summary.returnsDeltaPercent > 0 ? '+' : ''}${response.summary.returnsDeltaPercent}% from last month`,
        tone: 'rose',
      },
      {
        id: 'cancellations',
        title: 'Cancellations',
        valueLabel: numberFormatter.format(response.summary.totalCancellations),
        subLabel: `${response.summary.cancellationsDeltaPercent > 0 ? '+' : ''}${response.summary.cancellationsDeltaPercent}% from last month`,
        tone: 'slate',
      },
      {
        id: 'revenue',
        title: 'Impacted Revenue',
        valueLabel: formatCurrency(response.summary.impactedRevenue),
        subLabel: 'Estimated loss',
        tone: 'indigo',
      },
    ],
    tableRows: toTableRows(response.items),
    timelineGroups: toTimelineGroups(response.items),
    totalCount: response.totalCount,
    page: query.page,
    pageSize: query.pageSize,
    platformOptions: ORDERS_RETURNS_PLATFORM_OPTIONS,
    filters: {
      search: query.search,
      platform: query.platform,
    },
  }
}
