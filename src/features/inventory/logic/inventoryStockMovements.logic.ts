import type { InventoryStockMovementsResponse } from '@/features/inventory/logic/inventoryStockMovements.types'
import type {
  InventoryStockMovementChartEntry,
  InventoryStockMovementDayGroup,
  InventoryStockMovementGroupFilter,
  InventoryStockMovementRecord,
  InventoryStockMovementSummaryCardViewModel,
  InventoryStockMovementsQueryState,
  InventoryStockMovementsViewModel,
} from '@/features/inventory/logic/inventoryStockMovements.types'

const moneyFormatter = new Intl.NumberFormat('vi-VN')

const platformLabelMap = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok Shop',
} as const

const platformOptions = [
  { id: 'all' as const, label: 'Tất cả sàn' },
  { id: 'shopee' as const, label: 'Shopee' },
  { id: 'lazada' as const, label: 'Lazada' },
  { id: 'tiktok_shop' as const, label: 'TikTok Shop' },
]

const groupOptions: Array<{ id: InventoryStockMovementGroupFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'inbound', label: 'Nhập kho' },
  { id: 'outbound', label: 'Xuất kho' },
  { id: 'transfer', label: 'Điều chuyển' },
  { id: 'order', label: 'Đơn hàng' },
  { id: 'adjustment', label: 'Điều chỉnh' },
  { id: 'loss', label: 'Hao hụt' },
]

const movementToneMap = {
  inbound: 'emerald',
  outbound: 'rose',
  transfer: 'indigo',
  order: 'amber',
  adjustment: 'slate',
  loss: 'rose',
} as const

function formatQuantity(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${moneyFormatter.format(value)}`
}

function formatAbsoluteQuantity(value: number) {
  return moneyFormatter.format(Math.abs(value))
}

function formatTimeLabel(isoValue: string) {
  const date = new Date(isoValue)
  if (Number.isNaN(date.getTime())) return '--:--'

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function formatDayLabel(isoValue: string) {
  const date = new Date(isoValue)
  if (Number.isNaN(date.getTime())) return 'Ngày không xác định'

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

function normalizeDayLabel(isoValue: string) {
  const date = new Date(isoValue)
  if (Number.isNaN(date.getTime())) return isoValue

  return date.toISOString().slice(0, 10)
}

function movementGroupLabel(group: InventoryStockMovementRecord['movementGroup']) {
  return groupOptions.find((option) => option.id === group)?.label ?? 'Khác'
}

function movementTypeLabel(movementType: InventoryStockMovementRecord['movementType']) {
  switch (movementType) {
    case 'IMPORT':
      return 'Nhập hàng'
    case 'RETURN_RECEIVED':
      return 'Nhập hoàn'
    case 'TRANSFER_IN':
      return 'Điều chuyển vào'
    case 'TRANSFER_OUT':
      return 'Điều chuyển ra'
    case 'ORDER_RESERVE':
      return 'Giữ đơn'
    case 'ORDER_RELEASE':
      return 'Giải phóng đơn'
    case 'ORDER_FULFILL':
      return 'Xuất đơn'
    case 'MANUAL_ADJUSTMENT':
      return 'Điều chỉnh thủ công'
    case 'DAMAGE_LOSS':
      return 'Hao hụt / mất mát'
    default:
      return 'Biến động'
  }
}

function movementGroupOf(movementType: InventoryStockMovementRecord['movementType']): InventoryStockMovementRecord['movementGroup'] {
  switch (movementType) {
    case 'IMPORT':
    case 'RETURN_RECEIVED':
      return 'inbound'
    case 'ORDER_FULFILL':
      return 'outbound'
    case 'TRANSFER_OUT':
    case 'TRANSFER_IN':
      return 'transfer'
    case 'ORDER_RESERVE':
    case 'ORDER_RELEASE':
      return 'order'
    case 'MANUAL_ADJUSTMENT':
      return 'adjustment'
    case 'DAMAGE_LOSS':
      return 'loss'
    default:
      return 'adjustment'
  }
}

function movementToneOf(group: InventoryStockMovementRecord['movementGroup']) {
  return movementToneMap[group]
}

function buildDayGroups(items: InventoryStockMovementRecord[]): InventoryStockMovementDayGroup[] {
  const groups = new Map<string, InventoryStockMovementRecord[]>()

  items.forEach((item) => {
    const key = normalizeDayLabel(item.createdAt)
    const current = groups.get(key)

    if (current) {
      current.push(item)
      return
    }

    groups.set(key, [item])
  })

  return Array.from(groups.entries()).map(([dateLabel, groupItems]) => ({
    dateLabel: formatDayLabel(dateLabel),
    items: groupItems,
  }))
}

function toSummaryCards(response: InventoryStockMovementsResponse): InventoryStockMovementSummaryCardViewModel[] {
  return [
    {
      id: 'total-movements',
      label: 'Tổng biến động',
      value: moneyFormatter.format(response.summary.totalMovements),
      helperText: 'Sự kiện được lọc theo truy vấn hiện tại',
      tone: 'indigo',
    },
    {
      id: 'inbound',
      label: 'Nhập kho',
      value: `+${moneyFormatter.format(response.summary.inboundQty)}`,
      helperText: 'Tăng tồn thực tế',
      tone: 'emerald',
    },
    {
      id: 'outbound',
      label: 'Xuất / giảm kho',
      value: `-${moneyFormatter.format(response.summary.outboundQty)}`,
      helperText: 'Giữ nhịp xuất hàng và xử lý đơn',
      tone: 'rose',
    },
    {
      id: 'lazada',
      label: 'Biến động Lazada',
      value: moneyFormatter.format(response.summary.lazadaMovements),
      helperText: response.lazadaNote,
      tone: 'amber',
    },
  ]
}

function buildPlatformStats(response: InventoryStockMovementsResponse) {
  const total = Math.max(1, response.summary.totalMovements)

  return response.platformBreakdown.map((item) => ({
    ...item,
    percentage: Math.round((item.count / total) * 100),
  }))
}

function buildWarehouseStats(response: InventoryStockMovementsResponse) {
  const total = Math.max(1, response.summary.totalMovements)

  return response.warehouseBreakdown.map((item) => ({
    ...item,
    percentage: Math.round((item.count / total) * 100),
  }))
}

export function buildInventoryStockMovementsViewModel(args: {
  response: InventoryStockMovementsResponse
  query: InventoryStockMovementsQueryState
  selectedMovementId: string | null
  chartData: InventoryStockMovementChartEntry[]
  performerOptions: Array<{ id: string; label: string }>
  onExportLogs: () => void
}): InventoryStockMovementsViewModel {
  const { response, query, selectedMovementId, chartData, performerOptions, onExportLogs } = args
  
  // Tin tưởng dữ liệu từ API (đã được lọc và phân trang ở Server/Mock)
  const displayMovements = response.movements
  
  const selectedMovement =
    displayMovements.find((item) => String(item.id) === selectedMovementId) ?? displayMovements[0] ?? null

  return {
    title: response.title,
    subtitle: response.subtitle,
    updatedAtLabel: `Cập nhật ${response.updatedAt}`,
    suggestedActionLabel: response.suggestedActionLabel,
    lazadaNote: response.lazadaNote,
    summaryCards: toSummaryCards(response),
    platformStats: buildPlatformStats(response),
    groupStats: response.groupBreakdown,
    warehouseStats: buildWarehouseStats(response),
    movementGroups: buildDayGroups(displayMovements),
    totalCount: response.totalCount,
    page: query.page,
    pageSize: query.pageSize,
    query,
    selectedMovement,
    warehouseOptions: response.warehouseBreakdown.map((item) => ({ id: item.id, label: item.label })),
    platformOptions,
    groupOptions,
    chartData,
    performerOptions,
    onExportLogs,
  }
}

export function buildMovementMetadata(record: InventoryStockMovementRecord) {
  const group = movementGroupOf(record.movementType)

  return {
    movementGroup: group,
    movementGroupLabel: movementGroupLabel(group),
    movementTypeLabel: movementTypeLabel(record.movementType),
    movementTone: movementToneOf(group),
    deltaLabel: formatQuantity(record.delta),
    absoluteDeltaLabel: formatAbsoluteQuantity(record.delta),
    createdAtLabel: formatTimeLabel(record.createdAt),
  }
}

export { platformLabelMap }