import { describe, expect, it } from 'vitest'

import { buildTopProductsContributionBackground } from '@/features/dashboard/components/dashboard-top-products/TopProductsInsightsSection'
import {
  buildTopProductsCsv,
  getCollapsedVisibleRankingCount,
  getNextVisibleRankingCount,
} from '@/features/dashboard/components/dashboard-top-products/TopProductsRankingTable'

describe('buildTopProductsContributionBackground', () => {
  it('returns neutral fallback color when no contribution segments', () => {
    expect(buildTopProductsContributionBackground([])).toBe('#cbd5e1')
  })

  it('returns conic-gradient string when contribution exists', () => {
    const background = buildTopProductsContributionBackground([
      { id: 'a', label: 'A', percent: 35, color: '#111111' },
      { id: 'b', label: 'B', percent: 65, color: '#222222' },
    ])

    expect(background.startsWith('conic-gradient(')).toBe(true)
    expect(background).toContain('#111111')
    expect(background).toContain('#222222')
  })
})

describe('getNextVisibleRankingCount', () => {
  it('increases visible rows by step and does not exceed total', () => {
    expect(getNextVisibleRankingCount(6, 6, 20)).toBe(12)
    expect(getNextVisibleRankingCount(18, 6, 20)).toBe(20)
  })
})

describe('getCollapsedVisibleRankingCount', () => {
  it('resets visible rows to initial page size', () => {
    expect(getCollapsedVisibleRankingCount()).toBe(6)
  })
})

describe('buildTopProductsCsv', () => {
  it('contains only selected columns and escapes values', () => {
    const csv = buildTopProductsCsv(
      [
        {
          id: 'p-1',
          rankLabel: '01',
          name: 'Áo "Basic"',
          sku: 'SKU-1',
          platformLabel: 'Shopee',
          platformTone: 'shopee',
          imageUrl: '/test.png',
          soldLabel: '100',
          soldValue: 100,
          revenueLabel: '1.000.000 ₫',
          revenueValue: 1000000,
          avgPriceLabel: '10.000 ₫',
          avgPriceValue: 10000,
          returnRateLabel: '1%',
          returnRateValue: 1,
          trendTone: 'up',
          trendBars: [4, 5, 6, 7],
          sparklineData: [{ value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }],
          tags: [{ type: 'hero', label: 'Bestseller' }],
        },
      ],
      {
        sku: true,
        platform: false,
        sold: false,
        revenue: true,
        avgPrice: false,
        returnRate: false,
        trend: false,
        sparkline: false,
      },
    )

    expect(csv).toContain('"Hạng","Sản phẩm","SKU","Doanh thu"')
    expect(csv).toContain('"01","Áo ""Basic""","SKU-1","1.000.000 ₫"')
    expect(csv.includes('Sàn')).toBe(false)
  })
})
