import type {
  RevenueChartExportTarget,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueChartExportTable = {
  fileBaseName: string
  headers: string[]
  rows: string[][]
}

const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`

const toCsvContent = (table: RevenueChartExportTable) => [table.headers, ...table.rows].map((line) => line.map(csvCell).join(',')).join('\n')

const toExcelHtmlContent = (table: RevenueChartExportTable) => {
  const escape = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')

  const headerHtml = table.headers.map((header) => `<th>${escape(header)}</th>`).join('')
  const rowHtml = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join('')}</tr>`)
    .join('')

  return [
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">',
    '<head><meta charset="UTF-8" /></head>',
    '<body>',
    `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowHtml}</tbody></table>`,
    '</body></html>',
  ].join('')
}

const buildDailyTrendTable = (model: RevenueChartsViewModel): RevenueChartExportTable => ({
  fileBaseName: 'daily-trend',
  headers: ['Ngày', 'Tổng doanh thu', 'Kỳ trước', 'Voucher', 'Khuyến mãi', 'Shopee', 'Lazada', 'TikTok Shop'],
  rows: model.dailyChartPoints.map((point) => [
    point.dateLabel,
    `${Math.round(point.total)}`,
    `${Math.round(point.previousTotal)}`,
    `${Math.round(point.voucherRevenue)}`,
    `${Math.round(point.promotionRevenue)}`,
    `${Math.round(point.shopee)}`,
    `${Math.round(point.lazada)}`,
    `${Math.round(point.tiktokShop)}`,
  ]),
})

const buildHourlyDistributionTable = (model: RevenueChartsViewModel): RevenueChartExportTable => ({
  fileBaseName: 'hourly-distribution',
  headers: ['Khung giờ', 'Doanh thu', 'Cao điểm'],
  rows: model.hourlyPoints.map((point) => [point.hourLabel, `${Math.round(point.revenue)}`, point.isPeak ? 'Có' : 'Không']),
})

const buildCategoryBreakdownTable = (
  model: RevenueChartsViewModel,
  selectedCategoryId: string | null,
): RevenueChartExportTable => {
  const selectedCategory = selectedCategoryId
    ? model.categoryItems.find((item) => item.id === selectedCategoryId) ?? model.categoryItems[0]
    : model.categoryItems[0]

  const categoryRows = model.categoryItems.map((item) => [item.label, item.valueLabel, `${item.ratioPercent}%`])
  const productRows = selectedCategory
    ? selectedCategory.products.map((product) => [
        `  - ${product.name}`,
        product.revenueLabel,
        product.ordersLabel,
      ])
    : []

  return {
    fileBaseName: 'category-breakdown',
    headers: ['Danh mục / Sản phẩm', 'Doanh thu', 'Tỷ lệ hoặc số đơn'],
    rows: [...categoryRows, ...productRows],
  }
}

const buildOrderHeatmapTable = (model: RevenueChartsViewModel): RevenueChartExportTable => ({
  fileBaseName: 'order-heatmap',
  headers: ['Ngày', 'Giờ', 'Số đơn', 'Cường độ'],
  rows: model.heatmapCells.map((cell) => [cell.dayLabel, cell.hourLabel, `${cell.orderCount}`, `${Math.round(cell.intensity * 100)}%`]),
})

export function buildRevenueChartExportTable(input: {
  target: RevenueChartExportTarget
  model: RevenueChartsViewModel
  selectedCategoryId: string | null
}): RevenueChartExportTable {
  const { target, model, selectedCategoryId } = input

  if (target === 'hourly-distribution') return buildHourlyDistributionTable(model)
  if (target === 'category-breakdown') return buildCategoryBreakdownTable(model, selectedCategoryId)
  if (target === 'order-heatmap') return buildOrderHeatmapTable(model)
  return buildDailyTrendTable(model)
}

export function buildRevenueExportPayload(input: {
  target: RevenueChartExportTarget
  format: 'csv' | 'excel'
  model: RevenueChartsViewModel
  selectedCategoryId: string | null
}) {
  const table = buildRevenueChartExportTable({
    target: input.target,
    model: input.model,
    selectedCategoryId: input.selectedCategoryId,
  })

  if (input.format === 'excel') {
    return {
      fileName: `${table.fileBaseName}.xls`,
      mimeType: 'application/vnd.ms-excel;charset=utf-8;',
      content: toExcelHtmlContent(table),
    }
  }

  return {
    fileName: `${table.fileBaseName}.csv`,
    mimeType: 'text/csv;charset=utf-8;',
    content: toCsvContent(table),
  }
}
