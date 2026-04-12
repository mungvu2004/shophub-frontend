import {
  type OrdersPendingActionItem,
  type OrdersPendingActionsPlatformFilter,
  type OrdersPendingActionsQuery,
  type OrdersPendingActionsResponse,
  type OrdersPendingActionsSlaFilter,
  type OrdersPendingActionsTableRowModel,
  type OrdersPendingActionsViewModel,
} from '@/features/orders/logic/ordersPendingActions.types'

const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const TIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: '2-digit',
})

function getPlatformLabel(platform: OrdersPendingActionsPlatformFilter): string {
  if (platform === 'shopee') return 'Shopee'
  if (platform === 'lazada') return 'Lazada'
  if (platform === 'tiktok_shop') return 'TikTok Shop'
  return 'Tất cả sàn'
}

function getSlaLabel(sla: OrdersPendingActionsSlaFilter): string {
  if (sla === 'critical') return 'Nguy cấp'
  if (sla === 'warning') return 'Cảnh báo'
  if (sla === 'safe') return 'Ổn định'
  return 'Mọi SLA'
}

function getPlatformDotClass(platform: OrdersPendingActionsPlatformFilter): string {
  if (platform === 'shopee') return 'bg-orange-500'
  if (platform === 'lazada') return 'bg-blue-600'
  if (platform === 'tiktok_shop') return 'bg-black'
  return 'bg-slate-400'
}

function getWaitingPresentation(item: OrdersPendingActionItem): Pick<OrdersPendingActionsTableRowModel, 'waitingLabel' | 'waitingClassName'> {
  const waitingLabel = `${item.waitingMinutes} phút`

  if (item.slaLevel === 'critical') {
    return {
      waitingLabel,
      waitingClassName: 'text-rose-600',
    }
  }

  if (item.slaLevel === 'warning') {
    return {
      waitingLabel,
      waitingClassName: 'text-amber-600',
    }
  }

  return {
    waitingLabel,
    waitingClassName: 'text-emerald-600',
  }
}

function toTableRows(items: OrdersPendingActionItem[]): OrdersPendingActionsTableRowModel[] {
  return items.map((item) => {
    const waiting = getWaitingPresentation(item)

    return {
      id: item.id,
      orderCode: item.orderCode,
      platformLabel: getPlatformLabel(item.platform),
      platformDotClass: getPlatformDotClass(item.platform),
      customerName: item.customerName,
      productName: item.productName,
      amountLabel: CURRENCY_FORMATTER.format(item.amount),
      statusLabel: item.status,
      waitingLabel: waiting.waitingLabel,
      waitingClassName: waiting.waitingClassName,
      actionLabel: item.recommendedAction,
      actionClassName:
        item.slaLevel === 'critical'
          ? 'bg-rose-100 text-rose-700'
          : item.slaLevel === 'warning'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-slate-100 text-slate-600',
      updatedAtLabel: TIME_FORMATTER.format(new Date(item.updatedAt)),
    }
  })
}

export function buildOrdersPendingActionsViewModel(input: {
  response: OrdersPendingActionsResponse
  query: OrdersPendingActionsQuery
}): OrdersPendingActionsViewModel {
  const { response, query } = input

  return {
    heading: 'Đơn hàng cần xử lý',
    description: `Theo dõi SLA xử lý đơn theo thời gian thực. Bộ lọc hiện tại: ${getPlatformLabel(query.platform)} / ${getSlaLabel(query.sla)}.`,
    search: query.search,
    platform: query.platform,
    sla: query.sla,
    page: query.page,
    pageSize: query.pageSize,
    totalCount: response.totalCount,
    platformOptions: [
      { value: 'all', label: 'Tất cả sàn' },
      { value: 'shopee', label: 'Shopee' },
      { value: 'lazada', label: 'Lazada' },
      { value: 'tiktok_shop', label: 'TikTok Shop' },
    ],
    slaOptions: [
      { value: 'all', label: 'Mọi SLA' },
      { value: 'critical', label: 'Nguy cấp' },
      { value: 'warning', label: 'Cảnh báo' },
      { value: 'safe', label: 'Ổn định' },
    ],
    cards: [
      {
        id: 'total',
        title: 'Tổng đơn chờ xử lý',
        value: response.summary.totalPending.toLocaleString('vi-VN'),
        hint: 'Cần xử lý trong ca hiện tại',
        tone: 'indigo',
      },
      {
        id: 'critical',
        title: 'Nguy cấp SLA',
        value: response.summary.criticalCount.toLocaleString('vi-VN'),
        hint: 'Quá 120 phút chưa thao tác',
        tone: 'rose',
      },
      {
        id: 'warning',
        title: 'Cảnh báo SLA',
        value: response.summary.warningCount.toLocaleString('vi-VN'),
        hint: 'Từ 60-120 phút',
        tone: 'amber',
      },
      {
        id: 'avg_waiting',
        title: 'Thời gian chờ trung bình',
        value: `${Math.round(response.summary.avgWaitingMinutes)} phút`,
        hint: `Lazada: ${response.summary.platformBreakdown.lazada} đơn đang chờ`,
        tone: 'slate',
      },
    ],
    rows: toTableRows(response.items),
  }
}
