import { useEffect, useMemo, useState } from 'react'

import type { RevenueMlForecastScenarioCardViewModel, RevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.types'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
import {
  RevenueMlForecastBusinessContextSection,
  RevenueMlForecastChartSection,
  RevenueMlForecastHeaderSection,
  RevenueMlForecastHeadlineCardsSection,
  RevenueMlForecastScenarioTabsSection,
  RevenueMlForecastSmartAlertsBottomPanel,
} from './RevenueMlForecastSections'

function getBaselineScenario(scenarios: RevenueMlForecastScenarioCardViewModel[]) {
  return (
    scenarios.find((scenario) => scenario.accent === 'neutral') ??
    scenarios.find((scenario) => scenario.isRecommended) ??
    scenarios[Math.floor(scenarios.length / 2)] ??
    scenarios[0] ??
    null
  )
}

function buildScenarioAdjustedPoints(
  points: RevenueMlForecastViewModel['chartPoints'],
  selectedScenario: RevenueMlForecastScenarioCardViewModel | null,
  baselineScenario: RevenueMlForecastScenarioCardViewModel | null,
) {
  if (!selectedScenario || !baselineScenario) {
    return points
  }

  const baselineRevenue = baselineScenario.projectedRevenue
  const selectedRevenue = selectedScenario.projectedRevenue
  const revenueDeltaRatio = baselineRevenue > 0 ? (selectedRevenue - baselineRevenue) / baselineRevenue : 0

  const forecastPoints = points.filter((point) => point.forecast !== null)
  const forecastPointTotal = forecastPoints.length
  let forecastIndex = 0

  return points.map((point) => {
    if (point.forecast == null || point.confidenceLow == null || point.confidenceHigh == null) {
      return point
    }

    const progress = forecastPointTotal <= 1 ? 1 : forecastIndex / (forecastPointTotal - 1)
    forecastIndex += 1

    const curveFactor = 0.55 + progress * 0.45
    const forecastShift = point.forecast * revenueDeltaRatio * curveFactor
    const adjustedForecast = Math.max(0, Math.round(point.forecast + forecastShift))
    const spreadScale = 1 + Math.abs(revenueDeltaRatio) * 0.35
    const lowGap = point.forecast - point.confidenceLow
    const highGap = point.confidenceHigh - point.forecast

    return {
      ...point,
      forecast: adjustedForecast,
      confidenceLow: Math.max(0, Math.round(adjustedForecast - lowGap * spreadScale)),
      confidenceHigh: Math.max(
        adjustedForecast,
        Math.round(adjustedForecast + highGap * spreadScale),
      ),
    }
  })
}

export function RevenueMlForecastView({
  model,
  onRangeChange,
}: {
  model: RevenueMlForecastViewModel
  onRangeChange: (days: RevenueMlForecastRangeDays) => void
}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)

  useEffect(() => {
    const nextScenario = model.scenarios.find((scenario) => scenario.isRecommended) ?? model.scenarios[0] ?? null
    setSelectedScenarioId((current) => {
      if (current && model.scenarios.some((scenario) => scenario.id === current)) {
        return current
      }

      return nextScenario?.id ?? null
    })
  }, [model.scenarios])

  const selectedScenario = useMemo(
    () => model.scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? null,
    [model.scenarios, selectedScenarioId],
  )

  const baselineScenario = useMemo(() => getBaselineScenario(model.scenarios), [model.scenarios])

  const adjustedChartPoints = useMemo(
    () => buildScenarioAdjustedPoints(model.chartPoints, selectedScenario, baselineScenario),
    [baselineScenario, model.chartPoints, selectedScenario],
  )

  return (
    <div className="space-y-7">
      <RevenueMlForecastHeaderSection model={model.header} onRangeChange={onRangeChange} />
      <RevenueMlForecastHeadlineCardsSection cards={model.cards} />
      
      {/* Scenario Selection Tabs - Top */}
      <div>
        <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Kịch bản dự báo</h3>
        <RevenueMlForecastScenarioTabsSection
          scenarios={model.scenarios}
          selectedScenarioId={selectedScenarioId}
          onScenarioChange={setSelectedScenarioId}
        />
      </div>
      
      {/* Chart Section - Full Width */}
      <RevenueMlForecastChartSection
        title={model.chartTitle}
        points={adjustedChartPoints}
        legends={model.chartLegends}
        annotations={model.chartAnnotations}
        selectedScenarioLabel={selectedScenario?.title ?? ''}
      />
      
      {/* Smart Alerts Bottom Panel */}
      <RevenueMlForecastSmartAlertsBottomPanel
        actionPlan={model.actionPlan}
        selectedScenario={selectedScenario}
      />
      
      {/* Business Context Section */}
      <RevenueMlForecastBusinessContextSection
        channelBreakdown={model.channelBreakdown}
        targetRevenue={model.targetRevenue}
        gapToTarget={model.gapToTarget}
        currentRevenue={model.chartPoints[model.chartPoints.length - 1]?.forecast ?? 0}
        keyDrivers={model.keyDrivers}
      />
    </div>
  )
}
