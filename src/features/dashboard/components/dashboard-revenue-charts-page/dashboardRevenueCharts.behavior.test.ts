import { describe, expect, it } from 'vitest'

import { toDeltaIndicator } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueSummaryStrip'
import { shouldShowBlockingRevenueChartsError } from '@/features/dashboard/components/dashboard-revenue-charts-page/DashboardRevenueCharts'

describe('toDeltaIndicator', () => {
  it('returns empty indicator for neutral tone', () => {
    expect(toDeltaIndicator('neutral')).toBe('')
  })

  it('returns arrow indicators for up and down tones', () => {
    expect(toDeltaIndicator('up')).toBe('↑')
    expect(toDeltaIndicator('down')).toBe('↓')
  })
})

describe('shouldShowBlockingRevenueChartsError', () => {
  it('does not block screen when stale model exists', () => {
    expect(
      shouldShowBlockingRevenueChartsError({
        isError: true,
        hasModel: true,
      }),
    ).toBe(false)
  })

  it('blocks screen when request fails and no model is available', () => {
    expect(
      shouldShowBlockingRevenueChartsError({
        isError: true,
        hasModel: false,
      }),
    ).toBe(true)
  })
})
