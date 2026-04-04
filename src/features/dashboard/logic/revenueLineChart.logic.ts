import { addDays, format, isValid, parseISO, startOfDay, subDays } from 'date-fns'

import type {
  RevenueLineChartModelParams,
  RevenuePlatformKey,
  RevenueLineChartPoint,
  RevenueLineChartViewModel,
} from '@/features/dashboard/logic/revenueLineChart.types'

const DEFAULT_DAY_RANGE = 7

const CHART_LEGEND = [
  { key: 'shopee', label: 'SHOPEE', color: '#F97316' },
  { key: 'tiktok', label: 'TIKTOK', color: '#0F172A' },
  { key: 'lazada', label: 'LAZADA', color: '#3525CD' },
] as const

const toPlatformKey = (platform?: string): RevenuePlatformKey | null => {
  if (!platform) return null

  const normalized = platform.toLowerCase()

  if (normalized === 'tiktok_shop' || normalized === 'tiktok') return 'tiktok'
  if (normalized === 'shopee') return 'shopee'
  if (normalized === 'lazada') return 'lazada'

  return null
}

const resolveOrderDate = (createdAt?: string, createdAtPlatform?: string): Date | null => {
  const rawDate = createdAtPlatform ?? createdAt
  if (!rawDate) return null

  const parsedDate = parseISO(rawDate)
  if (!isValid(parsedDate)) return null

  return startOfDay(parsedDate)
}

function buildDateSkeleton(days: number, now: Date): RevenueLineChartPoint[] {
  const safeDays = Math.max(1, Math.floor(days))
  const endDate = startOfDay(now)
  const startDate = subDays(endDate, safeDays - 1)

  return Array.from({ length: safeDays }, (_, index) => {
    const currentDate = addDays(startDate, index)
    const isToday = index === safeDays - 1

    return {
      dateKey: format(currentDate, 'yyyy-MM-dd'),
      label: isToday ? 'Hôm nay' : format(currentDate, 'dd/MM'),
      shopee: 0,
      tiktok: 0,
      lazada: 0,
    }
  })
}

export function buildRevenueLineChartViewModel({
  orders = [],
  days = DEFAULT_DAY_RANGE,
  now = new Date(),
}: RevenueLineChartModelParams): RevenueLineChartViewModel {
  const points = buildDateSkeleton(days, now)
  const pointByDate = new Map(points.map((point) => [point.dateKey, point]))

  for (const order of orders) {
    const platformKey = toPlatformKey(order.platform)
    if (!platformKey) continue

    const amount = typeof order.totalAmount === 'number' && Number.isFinite(order.totalAmount) ? order.totalAmount : 0
    const orderDate = resolveOrderDate(order.createdAt, order.createdAt_platform)

    if (!orderDate) continue

    const bucketKey = format(orderDate, 'yyyy-MM-dd')
    const targetPoint = pointByDate.get(bucketKey)
    if (!targetPoint) continue

    targetPoint[platformKey] += Math.max(0, amount)
  }

  const hasData = points.some((point) => point.shopee > 0 || point.tiktok > 0 || point.lazada > 0)

  return {
    title: 'Doanh thu 7 ngày',
    subtitle: 'So sánh hiệu suất giữa các sàn',
    points,
    legend: [...CHART_LEGEND],
    hasData,
  }
}
