import { CATEGORY_CHART_COLORS, HOURLY_PEAK_THRESHOLD } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
import type {
  RevenueChartsPlatformId,
  RevenueChartsResponse,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

const currencyFormatter = new Intl.NumberFormat('vi-VN')

const formatCurrency = (value: number) => `${currencyFormatter.format(Math.round(value))}₫`

const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${Number((value / 1_000_000_000).toFixed(1))}B`
  }

  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}M`
  }

  return `${currencyFormatter.format(Math.round(value))}`
}

const formatDateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')

  return `${day}/${month}`
}

const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const toGrowthTone = (value: number): 'up' | 'down' | 'neutral' => {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'neutral'
}

const toPlatformTabs = () => [
  { id: 'all' as const, label: 'Tất cả' },
  { id: 'shopee' as const, label: 'Shopee' },
  { id: 'lazada' as const, label: 'Lazada' },
  { id: 'tiktok_shop' as const, label: 'TikTok Shop' },
]

const toRangeTabs = () => [
  { days: 30 as const, label: '30 ngày qua' },
  { days: 7 as const, label: '7 ngày qua' },
]

const categoryColors = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF']

const platformLabel = (platform: RevenueChartsPlatformId) => {
  if (platform === 'shopee') return 'Shopee'
  if (platform === 'lazada') return 'Lazada'
  if (platform === 'tiktok_shop') return 'TikTok Shop'
  return 'Tất cả sàn'
}

export const buildDashboardRevenueChartsViewModel = (input: {
  data: RevenueChartsResponse
  selectedPlatform: RevenueChartsPlatformId
}): RevenueChartsViewModel => {
  const { data, selectedPlatform } = input

  const summaryCards: RevenueChartsViewModel['summaryCards'] = [
    {
      id: 'total',
      label: 'Tổng doanh thu',
      value: formatCurrency(data.summary.totalRevenue),
      deltaLabel: `${Math.abs(data.summary.totalRevenueDeltaPercent)}%`,
      deltaTone: toGrowthTone(data.summary.totalRevenueDeltaPercent),
    },
    {
      id: 'avg',
      label: 'Doanh thu TB/ngày',
      value: formatCurrency(data.summary.averageRevenuePerDay),
      deltaLabel: `${Math.abs(data.summary.averageRevenueDeltaPercent)}%`,
      deltaTone: toGrowthTone(data.summary.averageRevenueDeltaPercent),
    },
    {
      id: 'highest',
      label: 'Ngày cao nhất',
      value: formatCurrency(data.summary.highestDayRevenue),
      dateLabel: formatDateLabel(data.summary.highestDayDate),
    },
    {
      id: 'lowest',
      label: 'Ngày thấp nhất',
      value: formatCurrency(data.summary.lowestDayRevenue),
      dateLabel: formatDateLabel(data.summary.lowestDayDate),
    },
  ]

  const dailyChartPoints = data.dailySeries.map((item) => ({
    dateLabel: formatDateLabel(item.date),
    isoDate: item.date,
    shopee: item.shopee,
    lazada: item.lazada,
    tiktokShop: item.tiktokShop,
    total: item.shopee + item.lazada + item.tiktokShop,
    previousTotal: item.previousTotal,
    voucherRevenue: item.voucherRevenue,
    promotionRevenue: item.promotionRevenue,
  }))

  const timelineEvents = data.timelineEvents.map((event) => ({
    id: event.id,
    dateLabel: formatDateLabel(event.date),
    isoDate: event.date,
    label: event.label,
    type: event.type,
    impactLabel: `${Math.abs(event.impactPercent)}%`,
  }))

  const maxCategoryRevenue = data.categoryBreakdown.reduce((max, item) => Math.max(max, item.revenue), 0)

  const categoryItems = data.categoryBreakdown.map((item, index) => ({
    id: item.id,
    label: item.label,
    revenue: item.revenue,
    valueLabel: formatCompactCurrency(item.revenue),
    ratioPercent: maxCategoryRevenue > 0 ? Math.round((item.revenue / maxCategoryRevenue) * 100) : 0,
    barColor: CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length],
    products: item.products.map((product) => ({
      id: product.id,
      name: product.name,
      revenueLabel: formatCurrency(product.revenue),
      ordersLabel: `${currencyFormatter.format(product.orders)} đơn`,
    })),
  }))

  const hourlyPoints = data.hourlyDistribution.map((item) => ({
    hourLabel: `${`${item.hour}`.padStart(2, '0')}h`,
    revenue: item.revenue,
    isPeak: item.hour >= HOURLY_PEAK_THRESHOLD.START && item.hour <= HOURLY_PEAK_THRESHOLD.END,
  }))

  const maxHeatValue = data.hourlyHeatmap.reduce((max, cell) => Math.max(max, cell.orderCount), 0)
  const heatmapCells = data.hourlyHeatmap.map((cell) => ({
    id: `${cell.dayIndex}-${cell.hour}`,
    dayLabel: dayLabels[cell.dayIndex] ?? `${cell.dayIndex}`,
    hourLabel: `${`${cell.hour}`.padStart(2, '0')}h`,
    hour: cell.hour,
    orderCount: cell.orderCount,
    intensity: maxHeatValue > 0 ? Number((cell.orderCount / maxHeatValue).toFixed(2)) : 0,
  }))

  const weeklyRows = data.weeklyComparison.map((item) => {
    const total = item.shopee + item.lazada + item.tiktokShop

    return {
      id: item.id,
      weekLabel: `${item.label} (${formatDateLabel(item.startDate)} - ${formatDateLabel(item.endDate)})`,
      shopeeLabel: formatCurrency(item.shopee),
      lazadaLabel: formatCurrency(item.lazada),
      tiktokShopLabel: formatCurrency(item.tiktokShop),
      totalLabel: formatCurrency(total),
      growthLabel: `${Math.abs(item.growthPercent)}%`,
      growthTone: item.growthPercent >= 0 ? ('up' as const) : ('down' as const),
    }
  })

  const goalProgressPercent = Math.max(0, Math.min(data.monthlyGoal.progressPercent, 100))
  const goalProgressDisplay = Number(goalProgressPercent.toFixed(1))

  return {
    updatedAtLabel: `Cập nhật lúc ${data.updatedAt}`,
    title: `Phân tích doanh thu theo thời gian - ${platformLabel(selectedPlatform)}`,
    rangeTabs: toRangeTabs(),
    selectedRange: data.rangeDays,
    platformTabs: toPlatformTabs(),
    selectedPlatform,
    summaryCards,
    goalLabel: `Mục tiêu ${data.monthlyGoal.monthLabel}: ${formatCurrency(data.monthlyGoal.targetRevenue)} - đạt ${goalProgressDisplay}% (${formatCurrency(data.monthlyGoal.achievedRevenue)})`,
    goalProgressPercent,
    goalProgressLabel: 'Tiến độ',
    dailyChartTitle: 'Doanh thu theo ngày',
    dailyChartPoints,
    timelineEvents,
    hourlyChartTitle: 'Phân bổ doanh thu theo giờ',
    peakHoursLabel: `Peak: ${data.peakHoursLabel}`,
    hourlyPoints,
    heatmapTitle: 'Mật độ đơn hàng theo ngày/giờ',
    heatmapCells,
    categoryChartTitle: 'Doanh thu theo danh mục',
    categoryItems,
    weeklyTableTitle: 'So sánh doanh thu theo tuần',
    weeklyRows,
    hasData: data.dailySeries.length > 0,
  }
}
