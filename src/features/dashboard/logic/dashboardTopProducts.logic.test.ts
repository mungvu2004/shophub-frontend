import { describe, expect, it } from 'vitest'

import {
  buildDashboardTopProductsViewModel,
  getTopProductsSubtitle,
} from '@/features/dashboard/logic/dashboardTopProducts.logic'
import type {
  DashboardTopProductItem,
  DashboardTopProductsResponse,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

function createProduct(index: number): DashboardTopProductItem {
  return {
    id: `product-${index}`,
    name: `Sản phẩm ${index}`,
    sku: `SKU-${index}`,
    platform: 'shopee',
    imageUrl: '',
    soldQty: 10 + index,
    revenue: 1000000 * index,
    avgPrice: 100000,
    returnRate: 1.5,
    trendPercent: 3.2,
  }
}

function createResponse(overrides?: Partial<DashboardTopProductsResponse>): DashboardTopProductsResponse {
  const ranking = Array.from({ length: 8 }, (_, index) => createProduct(index + 1))

  return {
    updatedAt: '14:35',
    metric: 'revenue',
    rangeDays: 30,
    platform: 'all',
    podium: ranking.slice(0, 3),
    ranking,
    insights: [],
    contribution: [
      { id: 'c1', label: 'A', percent: 40 },
      { id: 'c2', label: 'B', percent: 60 },
    ],
    declining: ranking.slice(5, 8),
    ...overrides,
  }
}

describe('getTopProductsSubtitle', () => {
  it('returns subtitle by selected metric', () => {
    expect(getTopProductsSubtitle('revenue')).toContain('doanh thu')
    expect(getTopProductsSubtitle('quantity')).toContain('số lượng')
    expect(getTopProductsSubtitle('returnRate')).toContain('tỷ lệ hoàn')
  })
})

describe('buildDashboardTopProductsViewModel', () => {
  it('keeps full ranking rows for table view-more behavior', () => {
    const model = buildDashboardTopProductsViewModel({
      data: createResponse(),
      selectedMetric: 'revenue',
      selectedRange: 30,
      selectedPlatform: 'all',
    })

    expect(model.rankingRows).toHaveLength(8)
  })

  it('uses metric-specific subtitle in model', () => {
    const model = buildDashboardTopProductsViewModel({
      data: createResponse(),
      selectedMetric: 'quantity',
      selectedRange: 30,
      selectedPlatform: 'all',
    })

    expect(model.subtitle).toContain('số lượng')
  })
})
