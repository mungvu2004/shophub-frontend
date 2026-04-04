import type {
  RevenueDailyPoint,
  RevenueProductProfitItem,
  RevenueRange,
  RevenueSummaryKpi,
  RevenueSummaryReportResponse,
} from '@/types/revenue.types'

export type RevenueSummaryKpiViewModel = {
  id: string
  label: string
  valueLabel: string
  deltaLabel: string
  deltaClassName: string
  note: string
}

export type RevenueTopProductViewModel = {
  id: string
  rank: string
  name: string
  valueLabel: string
  ratioPercent: number
}

export type RevenueProductProfitRowViewModel = {
  id: string
  name: string
  sku: string
  imageUrl: string
  revenueLabel: string
  costLabel: string
  profitLabel: string
  marginLabel: string
  marginClassName: string
  trend: RevenueProductProfitItem['trend']
  aiSuggestion: string
}

export type RevenueSummaryReportViewModel = {
  title: string
  periodLabel: string
  comparisonLabel: string
  kpis: RevenueSummaryKpiViewModel[]
  monthlyGoalLabel: string
  goalProgressPercent: number
  goalProgressLabel: string
  dailyRevenue: Array<RevenueDailyPoint & { label: string }>
  topProducts: RevenueTopProductViewModel[]
  maxTopRevenue: number
  profitMomentum: RevenueSummaryReportResponse['profitMomentum']
  profitMomentumMax: number
  productProfitRows: RevenueProductProfitRowViewModel[]
  totalProducts: number
}

const currencyFormatter = new Intl.NumberFormat('vi-VN')

const compactCurrencyFormatter = new Intl.NumberFormat('vi-VN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const toCurrencyLabel = (value: number) => `${currencyFormatter.format(Math.round(value))} ₫`

const toCompactCurrencyLabel = (value: number) => `${compactCurrencyFormatter.format(Math.round(value))}`

const toDeltaLabel = (value: number, tone: RevenueSummaryKpi['tone']) => {
  const absValue = Math.abs(value)

  if (tone === 'negative') {
    return `-${absValue.toFixed(1)}%`
  }

  return `+${absValue.toFixed(1)}%`
}

const toDeltaClassName = (tone: RevenueSummaryKpi['tone']) =>
  tone === 'negative'
    ? 'bg-rose-100 text-rose-700'
    : 'bg-emerald-100 text-emerald-700'

const toMarginClassName = (marginPercent: number) => {
  if (marginPercent >= 30) {
    return 'text-emerald-600'
  }

  if (marginPercent >= 15) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

const toTopProducts = (rows: RevenueSummaryReportResponse['topProducts']) => {
  const maxRevenue = rows.reduce((acc, item) => Math.max(acc, item.revenue), 0)

  return {
    maxRevenue,
    items: rows.map((item, index) => ({
      id: item.id,
      rank: String(index + 1).padStart(2, '0'),
      name: item.name,
      valueLabel: toCompactCurrencyLabel(item.revenue),
      ratioPercent: maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 0,
    })),
  }
}

const toProductProfitRows = (rows: RevenueProductProfitItem[]) => {
  return rows.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    imageUrl: item.imageUrl,
    revenueLabel: toCurrencyLabel(item.revenue),
    costLabel: toCurrencyLabel(item.cost),
    profitLabel: toCurrencyLabel(item.profit),
    marginLabel: `${item.marginPercent.toFixed(1)}%`,
    marginClassName: toMarginClassName(item.marginPercent),
    trend: item.trend,
    aiSuggestion: item.aiSuggestion,
  }))
}

export const filterProductProfits = (
  rows: RevenueProductProfitItem[],
  keyword: string,
) => {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) {
    return rows
  }

  return rows.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedKeyword)
      || item.sku.toLowerCase().includes(normalizedKeyword),
  )
}

export const paginateProductProfits = (
  rows: RevenueProductProfitItem[],
  page: number,
  pageSize: number,
) => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 5

  const start = (safePage - 1) * safePageSize
  const end = start + safePageSize

  return {
    page: safePage,
    pageSize: safePageSize,
    rows: rows.slice(start, end),
  }
}

const rangeSliceSizeMap: Record<RevenueRange, number> = {
  week: 7,
  month: 20,
  quarter: 12,
  year: 6,
}

export const getRevenueRangeLabel = (range: RevenueRange) => {
  if (range === 'week') {
    return 'Tuần gần nhất'
  }

  if (range === 'quarter') {
    return 'Quý 1/2026'
  }

  if (range === 'year') {
    return 'Năm 2026 (YTD)'
  }

  return 'Tháng 3/2026'
}

export const getRevenueComparisonLabel = (range: RevenueRange) => {
  if (range === 'week') {
    return 'Tuần trước (so sánh)'
  }

  if (range === 'quarter') {
    return 'Quý trước (so sánh)'
  }

  if (range === 'year') {
    return 'Năm trước (so sánh)'
  }

  return 'Tháng trước (so sánh)'
}

export const pickDailyRevenueByRange = (
  rows: RevenueDailyPoint[],
  range: RevenueRange,
) => {
  const sliceSize = rangeSliceSizeMap[range]
  const stableRows = rows.slice(-sliceSize)

  if (range === 'quarter') {
    return stableRows.filter((_, index) => index % 2 === 0)
  }

  if (range === 'year') {
    return stableRows.filter((_, index) => index % 2 === 0)
  }

  return stableRows
}

export const buildRevenueSummaryReportViewModel = (
  data: RevenueSummaryReportResponse,
  visibleRows: RevenueProductProfitItem[],
): RevenueSummaryReportViewModel => {
  const goalProgressPercent = data.monthlyGoal.target > 0
    ? Math.min(100, Math.round((data.monthlyGoal.current / data.monthlyGoal.target) * 100))
    : 0

  const topProducts = toTopProducts(data.topProducts)
  const profitMomentumMax = data.profitMomentum.reduce(
    (acc, item) => Math.max(acc, item.gross, item.net),
    0,
  )

  return {
    title: data.title,
    periodLabel: data.periodLabel,
    comparisonLabel: data.comparisonLabel,
    kpis: data.kpis.map((kpi) => ({
      id: kpi.id,
      label: kpi.label,
      valueLabel: toCurrencyLabel(kpi.value),
      deltaLabel: toDeltaLabel(kpi.deltaPercent, kpi.tone),
      deltaClassName: toDeltaClassName(kpi.tone),
      note: kpi.note,
    })),
    monthlyGoalLabel: toCurrencyLabel(data.monthlyGoal.target),
    goalProgressPercent,
    goalProgressLabel: `${toCurrencyLabel(data.monthlyGoal.current)} / ${toCurrencyLabel(data.monthlyGoal.target)}`,
    dailyRevenue: data.dailyRevenue.map((item) => ({
      ...item,
      label: String(item.day),
    })),
    topProducts: topProducts.items,
    maxTopRevenue: topProducts.maxRevenue,
    profitMomentum: data.profitMomentum,
    profitMomentumMax,
    productProfitRows: toProductProfitRows(visibleRows),
    totalProducts: data.productProfits.length,
  }
}
