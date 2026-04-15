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

function platformLabel(platform: PlatformCode) {
  return platformLabelMap[platform]
}

function statusLabel(status: OrderStatus) {
  return statusLabelMap[status]
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

function formatDateOnly(value?: string) {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'

  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function formatTimeOnly(value?: string) {
  if (!value) return '--:--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'

  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toNormalizedPercentages(counts: number[]) {
  const total = counts.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return counts.map(() => 0)

  const raw = counts.map((value) => (value / total) * 100)
  const base = raw.map((value) => Math.floor(value))
  let remaining = 100 - base.reduce((sum, value) => sum + value, 0)

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)

  for (let i = 0; i < order.length && remaining > 0; i += 1) {
    base[order[i].index] += 1
    remaining -= 1
  }

  return base
}

export type OrdersAllChartItem = {
  label: string
  count: number
  percent: number
  color: string
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

export function openPrintWindowWithHtml(content: string) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')

  const cleanup = () => {
    setTimeout(() => {
      iframe.remove()
    }, 500)
  }

  iframe.onload = () => {
    const frameWindow = iframe.contentWindow
    if (!frameWindow) {
      cleanup()
      return
    }

    frameWindow.focus()
    frameWindow.print()
    cleanup()
  }

  document.body.appendChild(iframe)
  iframe.srcdoc = content

  return true
}

export function buildOrdersAllCharts(input: {
  rows: OrdersAllTableRowModel[]
  statusTabs: OrdersAllViewModel['statusTabs']
}): { statusItems: OrdersAllChartItem[]; platformItems: OrdersAllChartItem[] } {
  const statusColorMap: Record<string, string> = {
    pending_group: '#f59e0b',
    shipping_group: '#3b82f6',
    delivered: '#10b981',
    return_group: '#ef4444',
  }

  const statusItems = input.statusTabs.filter((item) => item.id !== 'all')
  const statusPercentages = toNormalizedPercentages(statusItems.map((item) => item.count))

  const platformCounts = {
    Shopee: 0,
    Lazada: 0,
    TikTok: 0,
  }

  for (const row of input.rows) {
    if (row.platform === 'shopee') platformCounts.Shopee += 1
    if (row.platform === 'lazada') platformCounts.Lazada += 1
    if (row.platform === 'tiktok_shop') platformCounts.TikTok += 1
  }

  const platformPercentages = toNormalizedPercentages([platformCounts.Shopee, platformCounts.Lazada, platformCounts.TikTok])

  return {
    statusItems: statusItems.map((item, index) => ({
      label: item.label,
      count: item.count,
      percent: statusPercentages[index],
      color: statusColorMap[item.id] ?? '#94a3b8',
    })),
    platformItems: [
      { label: 'Shopee', count: platformCounts.Shopee, percent: platformPercentages[0], color: '#f97316' },
      { label: 'Lazada', count: platformCounts.Lazada, percent: platformPercentages[1], color: '#2563eb' },
      { label: 'TikTok', count: platformCounts.TikTok, percent: platformPercentages[2], color: '#0f172a' },
    ],
  }
}

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

export function buildOrdersAllCsv(orders: Order[]) {
  const headers = ['Mã đơn', 'Khách hàng', 'Sàn', 'Sản phẩm', 'Trạng thái', 'Tổng tiền', 'Ngày tạo']

  const rows = orders.map((order) => [
    order.externalOrderNumber || order.externalOrderId || order.id,
    toBuyerName(order),
    platformLabel(order.platform),
    order.items?.[0]?.productName || 'Sản phẩm',
    statusLabel(order.status),
    formatCurrency(order.totalAmount),
    formatDateOnly(order.createdAt ?? order.createdAt_platform),
  ])

  const toCsvCell = (value: string) => `"${value.replaceAll('"', '""')}"`

  return [headers, ...rows].map((line) => line.map(toCsvCell).join(',')).join('\n')
}

export function buildOrdersAllPrintHtml(orders: Order[]) {
  const cards = orders
    .map((order) => {
      const productName = order.items?.[0]?.productName || 'Sản phẩm'
      const quantity = order.items?.[0]?.qty ?? 1
      const orderCode = order.externalOrderNumber || order.externalOrderId || order.id
      const phone = order.buyerPhone || '--'
      const address = order.shippingAddress || '--'

      return `
        <section class="waybill-card">
          <header>
            <div>
              <p class="label">Vận đơn</p>
              <h1>${escapeHtml(orderCode)}</h1>
            </div>
            <div class="meta">${escapeHtml(platformLabel(order.platform))}</div>
          </header>
          <div class="grid">
            <div><span class="k">Khách hàng</span><span class="v">${escapeHtml(toBuyerName(order))}</span></div>
            <div><span class="k">SĐT</span><span class="v">${escapeHtml(phone)}</span></div>
            <div><span class="k">Địa chỉ</span><span class="v">${escapeHtml(address)}</span></div>
            <div><span class="k">Sản phẩm</span><span class="v">${escapeHtml(productName)}</span></div>
            <div><span class="k">Số lượng</span><span class="v">${escapeHtml(String(quantity))}</span></div>
            <div><span class="k">Trạng thái</span><span class="v">${escapeHtml(statusLabel(order.status))}</span></div>
          </div>
          <footer>
            <span>Ngày tạo: ${escapeHtml(formatDateOnly(order.createdAt ?? order.createdAt_platform))} ${escapeHtml(formatTimeOnly(order.createdAt ?? order.createdAt_platform))}</span>
            <span>Tổng tiền: ${escapeHtml(formatCurrency(order.totalAmount))}</span>
          </footer>
        </section>
      `
    })
    .join('')

  return `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>In vận đơn</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #0f172a;
            background: #fff;
          }
          .waybill-card {
            border: 1px solid #dbe2f0;
            border-radius: 16px;
            padding: 18px;
            margin: 0 0 16px 0;
            page-break-after: always;
          }
          .waybill-card:last-child { page-break-after: auto; }
          header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            gap: 16px;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 12px;
            margin-bottom: 14px;
          }
          .label { margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: .08em; }
          h1 { margin: 0; font-size: 24px; line-height: 1.2; }
          .meta { font-size: 12px; font-weight: 700; color: #334155; background: #eef2ff; padding: 6px 10px; border-radius: 999px; }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 16px;
          }
          .grid div { border: 1px solid #eef2f7; border-radius: 12px; padding: 10px 12px; }
          .k { display: block; font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
          .v { display: block; font-size: 14px; font-weight: 700; color: #0f172a; word-break: break-word; }
          footer {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            border-top: 1px dashed #cbd5e1;
            margin-top: 14px;
            padding-top: 10px;
            font-size: 12px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        ${cards || '<p style="padding:24px">Không có đơn để in.</p>'}
      </body>
    </html>
  `
}

export function countOrdersAllActiveAdvancedFilters(filters: {
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}) {
  return [filters.dateFrom, filters.dateTo, filters.minAmount, filters.maxAmount].filter((value) => value.trim().length > 0).length
}

function toRows(items: Order[]): OrdersAllTableRowModel[] {
  return items.map((order) => {
    const orderItems = order.items ?? []
    const firstProductName = orderItems[0]?.productName || 'Sản phẩm chưa đồng bộ'
    const productCount = orderItems.length
    const totalQuantity = orderItems.reduce((sum, item) => sum + Math.max(0, item.qty || 0), 0)

    const hasTrackingCode = orderItems.some((item) => Boolean(item.trackingCode?.trim()))
    const isPrintableStatus =
      order.status === 'Packed'
      || order.status === 'ReadyToShip'
      || order.status === 'Shipped'
      || order.status === 'Delivered'
    const printed = hasTrackingCode && isPrintableStatus

    return {
      id: order.id,
      code: order.externalOrderNumber || order.externalOrderId || order.id,
      platform: order.platform,
      platformLabel: platformLabelMap[order.platform],
      buyerName: toBuyerName(order),
      firstProductName,
      productCount,
      totalQuantity,
      productLabel: productCount > 1 ? `${firstProductName} +${productCount - 1} SP` : firstProductName,
      status: order.status,
      statusLabel: statusLabelMap[order.status],
      statusShortLabel: statusShortLabelMap[order.status],
      printStatus: printed ? 'printed' : 'not_printed',
      printStatusLabel: printed ? 'Đã in' : 'Chưa in',
      amountValue: order.totalAmount,
      amountLabel: formatCurrency(order.totalAmount),
      updatedAgoLabel: formatAgo(order.updatedAt_platform || order.updatedAt || order.createdAt_platform || order.createdAt),
      updatedAtMs: new Date(order.updatedAt_platform || order.updatedAt || order.createdAt_platform || order.createdAt).getTime() || 0,
      updatedTone: order.status === 'Cancelled' || order.status === 'FailedDelivery' ? 'danger' : 'default',
    }
  })
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
