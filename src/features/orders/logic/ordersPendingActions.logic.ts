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

export function buildTodayDateRange(reference = new Date()) {
  const start = new Date(reference)
  start.setHours(0, 0, 0, 0)

  const end = new Date(reference)
  end.setHours(23, 59, 59, 999)

  return {
    dateFrom: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
    dateTo: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
  }
}

export function buildLastDaysDateRange(days: number, reference = new Date()) {
  const safeDays = Math.max(1, Math.floor(days))
  const end = new Date(reference)
  end.setHours(23, 59, 59, 999)

  const start = new Date(end)
  start.setDate(end.getDate() - (safeDays - 1))
  start.setHours(0, 0, 0, 0)

  return {
    dateFrom: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
    dateTo: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
  }
}

export function buildOrdersPendingActionsCsv(rows: OrdersPendingActionsTableRowModel[]) {
  const headers = ['Mã đơn', 'Khách hàng', 'Sàn', 'Sản phẩm', 'Giá trị', 'Trạng thái in', 'Chờ xử lý', 'Cập nhật']
  const toCsvCell = (value: string) => `"${value.replaceAll('"', '""')}"`

  return [
    headers,
    ...rows.map((row) => [
      row.orderCode,
      row.customerName,
      row.platformLabel,
      row.productName,
      row.amountLabel,
      row.printStatusLabel,
      row.waitingLabel,
      row.updatedAtLabel,
    ]),
  ].map((line) => line.map(toCsvCell).join(',')).join('\n')
}

export function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}

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

function getPlatformMarkClass(platform: OrdersPendingActionsPlatformFilter): string {
  if (platform === 'shopee') return 'bg-orange-100 text-orange-700'
  if (platform === 'lazada') return 'bg-blue-100 text-blue-700'
  if (platform === 'tiktok_shop') return 'bg-neutral-200 text-neutral-800'
  return 'bg-slate-200 text-slate-700'
}

function getPlatformMarkText(platform: OrdersPendingActionsPlatformFilter): string {
  if (platform === 'shopee') return 'S'
  if (platform === 'lazada') return 'L'
  if (platform === 'tiktok_shop') return 'T'
  return 'A'
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
    const actionLabel =
      item.slaLevel === 'critical'
        ? 'Xác nhận + kho'
        : item.slaLevel === 'warning'
          ? 'Nhắc xử lý'
          : 'Theo dõi'

    return {
      id: item.id,
      orderCode: item.orderCode,
      platformLabel: getPlatformLabel(item.platform),
      platformMarkText: getPlatformMarkText(item.platform),
      platformMarkClass: getPlatformMarkClass(item.platform),
      customerName: item.customerName,
      hasCustomerNote: Boolean(item.customerNote?.trim()),
      customerNoteText: item.customerNote?.trim() || 'Không có ghi chú',
      productName: item.productName,
      productSku: item.sku,
      productVariantLabel: item.variantLabel,
      productQuantity: item.quantity,
      productThumbnailUrl: item.thumbnailUrl,
      amountValue: item.amount,
      amountLabel: CURRENCY_FORMATTER.format(item.amount),
      statusLabel: item.status,
      printStatus: item.printStatus,
      printStatusLabel: item.printStatus === 'printed' ? 'Đã in' : 'Chưa in',
      waitingLabel: waiting.waitingLabel,
      waitingMinutes: item.waitingMinutes,
      waitingClassName: waiting.waitingClassName,
      actionLabel,
      actionClassName:
        item.slaLevel === 'critical'
          ? 'bg-rose-100 text-rose-700'
          : item.slaLevel === 'warning'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-slate-100 text-slate-600',
      updatedAtLabel: TIME_FORMATTER.format(new Date(item.updatedAt)),
      updatedAtMs: new Date(item.updatedAt).getTime() || 0,
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
