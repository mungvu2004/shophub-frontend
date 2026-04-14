import { describe, expect, it } from 'vitest'
import { buildDashboardKPIOverviewViewModel, calculatePlatformMetricsAt } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

function createOrder(partial: Partial<RevenueOrderItem>): RevenueOrderItem {
  return {
    id: partial.id ?? 'order-default',
    platform: partial.platform ?? 'shopee',
    status: partial.status ?? 'completed',
    totalAmount: partial.totalAmount ?? 100000,
    createdAt: partial.createdAt,
    items: partial.items ?? [],
  }
}

describe('calculatePlatformMetricsAt', () => {
  it('normalizes tiktok_shop into TIKTOK breakdown', () => {
    const now = new Date('2026-04-12T10:00:00.000Z')

    const orders: RevenueOrderItem[] = [
      createOrder({ id: 'o1', platform: 'tiktok_shop', createdAt: '2026-04-12T09:00:00.000Z' }),
      createOrder({ id: 'o2', platform: 'tiktok', createdAt: '2026-04-12T10:00:00.000Z' }),
      createOrder({ id: 'o3', platform: 'lazada', createdAt: '2026-04-12T11:00:00.000Z' }),
    ]

    const metrics = calculatePlatformMetricsAt(orders, { now })
    const totalOrdersMetric = metrics.find((metric) => metric.id === 'total-orders')

    expect(totalOrdersMetric).toBeDefined()
    expect(totalOrdersMetric?.breakdown?.find((item) => item.label === 'TIKTOK')?.value).toBe('2')
  })

  it('sets urgent-orders trend with sign and warning tone when cancellation rate increases', () => {
    const now = new Date('2026-04-12T10:00:00.000Z')

    const orders: RevenueOrderItem[] = [
      createOrder({ id: 't1', status: 'cancelled', createdAt: '2026-04-12T09:00:00.000Z' }),
      createOrder({ id: 't2', status: 'completed', createdAt: '2026-04-12T10:00:00.000Z' }),
      createOrder({ id: 'y1', status: 'completed', createdAt: '2026-04-11T09:00:00.000Z' }),
      createOrder({ id: 'y2', status: 'completed', createdAt: '2026-04-11T10:00:00.000Z' }),
    ]

    const metrics = calculatePlatformMetricsAt(orders, { now })
    const urgentOrdersMetric = metrics.find((metric) => metric.id === 'urgent-orders')

    expect(urgentOrdersMetric).toBeDefined()
    expect(urgentOrdersMetric?.changeLabel?.startsWith('+')).toBe(true)
    expect(urgentOrdersMetric?.changeTone).toBe('warning')
  })
})

describe('buildDashboardKPIOverviewViewModel', () => {
  it('preserves explicit alert-summary breakdown message', () => {
    const customMessage = 'Cần xử lý 5 đơn hủy'

    const model = buildDashboardKPIOverviewViewModel({
      metrics: [
        {
          id: 'urgent-orders',
          title: 'CẦN XỬ LÝ NGAY',
          value: '5',
          placeholderLayout: 'alert-summary',
          breakdown: [{ label: '', value: customMessage }],
          changeTone: 'warning',
        },
      ],
    })

    expect(model.metrics[0].breakdown?.[0]?.value).toBe(customMessage)
  })
})
