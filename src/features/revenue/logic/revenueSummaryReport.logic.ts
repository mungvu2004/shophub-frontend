import type {
  RevenueCostBreakdownItem,
  RevenueDailyPoint,
  RevenueKpiDisplayType,
  RevenueProductProfitItem,
  RevenueProfitFlowStep,
  RevenueRange,
  RevenueSummaryPlatformFilter,
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
  revenueValue: number
  revenueLabel: string
  costValue: number
  costLabel: string
  profitValue: number
  profitLabel: string
  marginValue: number
  marginLabel: string
  marginClassName: string
  returnCancellationRateValue: number
  returnCancellationRateLabel: string
  returnCancellationRateClassName: string
  trend: RevenueProductProfitItem['trend']
  aiSuggestion: string
}

export type RevenueCostBreakdownViewModel = {
  id: string
  label: string
  amount: number
  amountLabel: string
  percentLabel: string
  color: string
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
  costBreakdown: RevenueCostBreakdownViewModel[]
  topProducts: RevenueTopProductViewModel[]
  maxTopRevenue: number
  profitFlow: Array<RevenueProfitFlowStep & { amountLabel: string }>
  profitFlowMax: number
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

const toNumberLabel = (value: number) => currencyFormatter.format(Math.round(value))

const toPercentLabel = (value: number) => `${value.toFixed(1)}%`

const toKpiValueLabel = (value: number, displayType: RevenueKpiDisplayType = 'currency') => {
  if (displayType === 'number') {
    return toNumberLabel(value)
  }

  if (displayType === 'percent') {
    return toPercentLabel(value)
  }

  return toCurrencyLabel(value)
}

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

const toReturnCancellationRateClassName = (value: number) => {
  if (value <= 2) {
    return 'text-emerald-600'
  }

  if (value <= 4) {
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
    revenueValue: item.revenue,
    revenueLabel: toCurrencyLabel(item.revenue),
    costValue: item.cost,
    costLabel: toCurrencyLabel(item.cost),
    profitValue: item.profit,
    profitLabel: toCurrencyLabel(item.profit),
    marginValue: item.marginPercent,
    marginLabel: `${item.marginPercent.toFixed(1)}%`,
    marginClassName: toMarginClassName(item.marginPercent),
    returnCancellationRateValue: item.returnCancellationRatePercent,
    returnCancellationRateLabel: toPercentLabel(item.returnCancellationRatePercent),
    returnCancellationRateClassName: toReturnCancellationRateClassName(item.returnCancellationRatePercent),
    trend: item.trend,
    aiSuggestion: item.aiSuggestion,
  }))
}

const scaleRevenueNumber = (value: number, scaleFactor: number) => Math.round(value * scaleFactor)

const costMixMultiplierByPlatform: Record<Exclude<RevenueSummaryPlatformFilter, 'all'>, Record<string, number>> = {
  shopee: {
    'cb-platform-fee': 1.25,
    'cb-shipping': 1.05,
    'cb-ads': 0.92,
    'cb-packaging': 1,
  },
  lazada: {
    'cb-platform-fee': 0.9,
    'cb-shipping': 1.15,
    'cb-ads': 0.85,
    'cb-packaging': 1.05,
  },
  tiktok: {
    'cb-platform-fee': 0.78,
    'cb-shipping': 0.95,
    'cb-ads': 1.45,
    'cb-packaging': 0.92,
  },
}

const getFlowCostIdByStepId = (stepId: string) => {
  if (stepId === 'pf-platform-fee') return 'cb-platform-fee'
  if (stepId === 'pf-shipping') return 'cb-shipping'
  if (stepId === 'pf-ads') return 'cb-ads'
  if (stepId === 'pf-packaging') return 'cb-packaging'

  return null
}

const getScaleFactorByPlatform = (
  rows: RevenueDailyPoint[],
  platform: RevenueSummaryPlatformFilter,
) => {
  if (platform === 'all') {
    return 1
  }

  const totalAll = rows.reduce((acc, point) => acc + point.shopee + point.tiktok + point.lazada, 0)

  if (totalAll <= 0) {
    return 1
  }

  const totalByPlatform = rows.reduce((acc, point) => acc + point[platform], 0)

  return totalByPlatform / totalAll
}

export const applyRevenuePlatformFilter = (
  data: RevenueSummaryReportResponse,
  platform: RevenueSummaryPlatformFilter,
) => {
  if (platform === 'all') {
    return data
  }

  const scaleFactor = getScaleFactorByPlatform(data.dailyRevenue, platform)

  const targetCostTotal = data.costBreakdown.reduce((acc, item) => acc + scaleRevenueNumber(item.amount, scaleFactor), 0)
  const platformMix = costMixMultiplierByPlatform[platform]

  const weightedCostRows = data.costBreakdown.map((item) => {
    const weighted = item.amount * (platformMix[item.id] ?? 1)

    return {
      ...item,
      weighted,
    }
  })

  const weightedTotal = weightedCostRows.reduce((acc, item) => acc + item.weighted, 0)

  const filteredCostBreakdown = weightedCostRows.map((item) => {
    const ratio = weightedTotal > 0 ? item.weighted / weightedTotal : 0

    return {
      ...item,
      amount: Math.round(targetCostTotal * ratio),
    }
  })

  const costById = new Map(filteredCostBreakdown.map((item) => [item.id, item.amount]))

  return {
    ...data,
    kpis: data.kpis.map((kpi) => ({
      ...kpi,
      value: kpi.displayType === 'percent'
        ? kpi.value
        : scaleRevenueNumber(kpi.value, scaleFactor),
    })),
    monthlyGoal: {
      current: scaleRevenueNumber(data.monthlyGoal.current, scaleFactor),
      target: scaleRevenueNumber(data.monthlyGoal.target, scaleFactor),
    },
    dailyRevenue: data.dailyRevenue.map((point) => ({
      ...point,
      shopee: platform === 'shopee' ? point.shopee : 0,
      tiktok: platform === 'tiktok' ? point.tiktok : 0,
      lazada: platform === 'lazada' ? point.lazada : 0,
      previous: scaleRevenueNumber(point.previous, scaleFactor),
    })),
    costBreakdown: filteredCostBreakdown,
    topProducts: data.topProducts.map((item) => ({
      ...item,
      revenue: scaleRevenueNumber(item.revenue, scaleFactor),
    })),
    profitFlow: data.profitFlow.map((item) => {
      const mappedCostId = getFlowCostIdByStepId(item.id)

      if (mappedCostId) {
        return {
          ...item,
          amount: costById.get(mappedCostId) ?? scaleRevenueNumber(item.amount, scaleFactor),
        }
      }

      return {
        ...item,
        amount: scaleRevenueNumber(item.amount, scaleFactor),
      }
    }),
    productProfits: data.productProfits.map((item) => ({
      ...item,
      revenue: scaleRevenueNumber(item.revenue, scaleFactor),
      cost: scaleRevenueNumber(item.cost, scaleFactor),
      profit: scaleRevenueNumber(item.profit, scaleFactor),
    })),
  }
}

const toCostBreakdown = (rows: RevenueCostBreakdownItem[]) => {
  const total = rows.reduce((acc, item) => acc + item.amount, 0)

  return rows.map((item) => ({
    id: item.id,
    label: item.label,
    amount: item.amount,
    amountLabel: toCurrencyLabel(item.amount),
    percentLabel: total > 0 ? `${((item.amount / total) * 100).toFixed(1)}%` : '0.0%',
    color: item.color,
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

const formatMonthYearLabel = (date: Date) => `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`

const getQuarter = (date: Date) => Math.floor(date.getMonth() / 3) + 1

export const getRevenueRangeLabel = (range: RevenueRange, baseDate: Date = new Date()) => {
  if (range === 'week') {
    return 'Tuần gần nhất'
  }

  if (range === 'quarter') {
    return `Quý ${getQuarter(baseDate)}/${baseDate.getFullYear()}`
  }

  if (range === 'year') {
    return `Năm ${baseDate.getFullYear()} (YTD)`
  }

  return formatMonthYearLabel(baseDate)
}

export const getRevenueComparisonLabel = (range: RevenueRange, baseDate: Date = new Date()) => {
  if (range === 'week') {
    return 'Tuần trước (so sánh)'
  }

  if (range === 'quarter') {
    return 'Quý trước (so sánh)'
  }

  if (range === 'year') {
    return 'Năm trước (so sánh)'
  }

  const previousMonthDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1)

  return `${formatMonthYearLabel(previousMonthDate)} (so sánh)`
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
  const profitFlowMax = data.profitFlow.reduce(
    (acc, item) => Math.max(acc, Math.abs(item.amount)),
    0,
  )

  return {
    title: data.title,
    periodLabel: data.periodLabel,
    comparisonLabel: data.comparisonLabel,
    kpis: data.kpis.map((kpi) => ({
      id: kpi.id,
      label: kpi.label,
      valueLabel: kpi.id === 'net-revenue'
        ? `${toCurrencyLabel(kpi.value)} / ${toCurrencyLabel(data.monthlyGoal.target)}`
        : toKpiValueLabel(kpi.value, kpi.displayType),
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
    costBreakdown: toCostBreakdown(data.costBreakdown),
    topProducts: topProducts.items,
    maxTopRevenue: topProducts.maxRevenue,
    profitFlow: data.profitFlow.map((item) => ({
      ...item,
      amountLabel: toCurrencyLabel(item.amount),
    })),
    profitFlowMax,
    productProfitRows: toProductProfitRows(visibleRows),
    totalProducts: data.productProfits.length,
  }
}
