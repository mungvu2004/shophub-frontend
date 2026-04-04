import type {
  InventoryAIForecastResponse,
  InventoryAIForecastTableRow,
} from '@/features/inventory/services/inventoryAIForecastService'
import type {
  ForecastTableFilter,
  InventoryAIForecastTableRowViewModel,
  InventoryAIForecastViewModel,
} from '@/features/inventory/logic/inventoryAIForecast.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime())
    ? '--/--/----'
    : date.toLocaleDateString('vi-VN')
}

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime())
    ? '--/--/---- --:--'
    : date.toLocaleString('vi-VN', {
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
}

const toStatus = (row: InventoryAIForecastTableRow): Exclude<ForecastTableFilter, 'all'> => {
  if (row.action === 'URGENT_RESTOCK' || row.forecastDays <= 3) {
    return 'urgent'
  }

  if (row.action === 'PLAN_RESTOCK' || row.forecastDays <= 14) {
    return 'warning'
  }

  return 'healthy'
}

const formatUnits = (value: number) => `${numberFormatter.format(Math.max(0, value))} units`

const formatForecastLabel = (value: number) => {
  if (value < 1) {
    return '< 24 giờ'
  }

  return `${numberFormatter.format(value)} ngày`
}

const formatPercent = (value: number) => `${Math.max(0, Math.round(value))}%`

export function buildInventoryAIForecastViewModel(payload: InventoryAIForecastResponse): InventoryAIForecastViewModel {
  const tableRows = payload.allForecastRows.map<InventoryAIForecastTableRowViewModel>((row) => ({
    id: row.id,
    sku: row.sku,
    productName: row.productName,
    currentStockLabel: numberFormatter.format(row.currentStock),
    avgDailySalesLabel: row.avgDailySales.toFixed(1),
    forecastLabel: formatForecastLabel(row.forecastDays),
    suggestedInboundLabel: row.suggestedInboundQty > 0 ? numberFormatter.format(row.suggestedInboundQty) : '0',
    confidenceLabel: formatPercent(row.confidencePercent),
    status: toStatus(row),
  }))

  const urgentCount = tableRows.filter((row) => row.status === 'urgent').length
  const warningCount = tableRows.filter((row) => row.status === 'warning').length
  const healthyCount = tableRows.filter((row) => row.status === 'healthy').length

  return {
    title: 'Dự báo Tồn kho AI',
    modelDescription: `Model: ${payload.model.name} · Cập nhật: ${formatDateTime(payload.model.updatedAt)} · Độ chính xác 30 ngày qua:`,
    modelAccuracyLabel: formatPercent(payload.model.accuracyRate),
    modelInputLabel: `${numberFormatter.format(payload.model.inputSkuCount)} SKU · ${numberFormatter.format(payload.model.historyDays)} ngày lịch sử`,
    modelRunLabel: formatDateTime(payload.model.lastRunAt),
    modelStatusText: payload.model.statusText,
    urgentTitle: 'Cần nhập hàng gấp',
    watchTitle: 'Sắp cạn nhập - 7-14 ngày',
    totalRowsLabel: `Hiển thị ${numberFormatter.format(tableRows.length)} trong tổng ${numberFormatter.format(payload.model.inputSkuCount)} SKU`,
    generatedAtLabel: formatDateTime(payload.generatedAt),
    urgentCards: payload.urgentRestocks.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      confidenceLabel: formatPercent(item.confidencePercent),
      currentStockLabel: formatUnits(item.currentStock),
      stockoutLabel: `${formatForecastLabel(item.stockoutDays)} (${formatDate(item.stockoutDate)})`,
      suggestedInboundLabel: formatUnits(item.suggestedInboundQty),
      reasons: item.reasons,
      fillRateLabel: formatPercent(item.fillRatePercent),
    })),
    watchCards: payload.watchlist.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      currentStockLabel: numberFormatter.format(item.currentStock),
      forecastLabel: formatForecastLabel(item.predictedStockoutDays),
      suggestedInboundLabel: formatUnits(item.predictedInboundQty),
      confidenceLabel: formatPercent(item.confidencePercent),
    })),
    tableRows,
    tabs: [
      { id: 'all', label: 'Tất cả', count: tableRows.length },
      { id: 'urgent', label: 'Cần nhập gấp', count: urgentCount },
      { id: 'warning', label: 'Sắp cạn', count: warningCount },
      { id: 'healthy', label: 'Đủ hàng', count: healthyCount },
    ],
  }
}

export function filterForecastRows(
  rows: InventoryAIForecastTableRowViewModel[],
  filter: ForecastTableFilter,
): InventoryAIForecastTableRowViewModel[] {
  if (filter === 'all') {
    return rows
  }

  return rows.filter((row) => row.status === filter)
}
