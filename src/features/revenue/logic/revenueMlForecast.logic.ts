import type {
  RevenueMlForecastChartPoint,
  RevenueMlForecastKpiCard,
  RevenueMlForecastRangeDays,
  RevenueMlForecastResponse,
  RevenueMlForecastScenario,
} from '@/types/revenue.types'
import type {
  RevenueMlForecastActionPlanViewModel,
  RevenueMlForecastChartAnnotationViewModel,
  RevenueMlForecastChartLegendViewModel,
  RevenueMlForecastChartPointViewModel,
  RevenueMlForecastKpiCardViewModel,
  RevenueMlForecastScenarioCardViewModel,
  RevenueMlForecastViewModel,
} from '@/features/revenue/logic/revenueMlForecast.types'

const currencyFormatter = new Intl.NumberFormat('vi-VN')

const toCurrencyLabel = (value: number) => `${currencyFormatter.format(Math.round(value))} ₫`

const toCompactCurrencyLabel = (value: number) => {
  const millionValue = value / 1_000_000

  if (millionValue >= 1) {
    return `${millionValue.toFixed(1)}M`
  }

  return currencyFormatter.format(Math.round(value))
}

const toForecastRangeLabel = (minValue: number, maxValue: number) => {
  return `${toCompactCurrencyLabel(minValue)} - ${toCompactCurrencyLabel(maxValue)} ₫`
}

const getRangeLabel = (days: RevenueMlForecastRangeDays) => `${days} ngày`

const getTrendClassName = (trend: 'positive' | 'negative' | 'neutral') => {
  if (trend === 'positive') {
    return 'text-emerald-600'
  }

  if (trend === 'negative') {
    return 'text-rose-600'
  }

  return 'text-slate-500'
}

const toKpiCardViewModel = (card: RevenueMlForecastKpiCard): RevenueMlForecastKpiCardViewModel => {
  if (card.type === 'forecast') {
    return {
      id: card.id,
      label: card.label,
      valueLabel: toCurrencyLabel(card.predictionValue),
      subValueLabel: toForecastRangeLabel(card.rangeMin, card.rangeMax),
      trendLabel: card.trendPercent ? `${card.trendPercent > 0 ? '+' : ''}${card.trendPercent.toFixed(1)}% vs T3` : undefined,
      trendClassName: card.trendPercent ? getTrendClassName(card.trendPercent > 0 ? 'positive' : card.trendPercent < 0 ? 'negative' : 'neutral') : undefined,
      tagLabel: `${Math.round(card.confidencePercent)}%`,
      accent: 'default',
    }
  }

  if (card.type === 'peak') {
    return {
      id: card.id,
      label: card.label,
      valueLabel: card.peakWindow,
      subValueLabel: card.reason,
      tagLabel: card.peakType,
      accent: 'default',
    }
  }

  return {
    id: card.id,
    label: card.label,
    valueLabel: `${card.riskCount} yếu tố rủi ro`,
    subValueLabel: card.riskSummary,
    ctaLabel: card.ctaLabel,
    accent: 'warning',
  }
}

const toChartPoint = (point: RevenueMlForecastChartPoint): RevenueMlForecastChartPointViewModel => ({
  label: point.label,
  historical: point.historical,
  forecast: point.forecast,
  confidenceLow: point.confidenceLow,
  confidenceHigh: point.confidenceHigh,
})

const toScenarioCard = (scenario: RevenueMlForecastScenario): RevenueMlForecastScenarioCardViewModel => ({
  id: scenario.id,
  title: scenario.title,
  valueLabel: toCurrencyLabel(scenario.projectedRevenue),
  note: scenario.note,
  accent: scenario.accent,
  isRecommended: scenario.isRecommended,
})

const toActionPlan = (
  actionPlan: RevenueMlForecastResponse['actionPlan'],
): RevenueMlForecastActionPlanViewModel => ({
  title: actionPlan.title,
  steps: actionPlan.steps,
  ctaLabel: actionPlan.ctaLabel,
})

const defaultLegends: RevenueMlForecastChartLegendViewModel[] = [
  {
    id: 'history',
    label: 'Lịch sử',
    type: 'line',
    color: '#111c2d',
  },
  {
    id: 'forecast',
    label: 'Dự báo AI',
    type: 'dashed',
    color: '#3525cd',
  },
  {
    id: 'confidence',
    label: 'Độ tin cậy',
    type: 'block',
    color: '#e0e7ff',
  },
]

const toChartAnnotations = (
  rows: RevenueMlForecastResponse['chart']['annotations'],
): RevenueMlForecastChartAnnotationViewModel[] => {
  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    note: item.note,
    xLabel: item.xLabel,
    tone: item.tone,
  }))
}

export function buildRevenueMlForecastViewModel(
  data: RevenueMlForecastResponse,
  selectedDays: RevenueMlForecastRangeDays,
): RevenueMlForecastViewModel {
  return {
    header: {
      title: data.title,
      modelLabel: data.modelLabel,
      accuracyLabel: `${Math.round(data.accuracyPercent * 10) / 10}%`,
      updateLabel: data.lastUpdatedLabel,
      rangeOptions: data.rangeOptions.map((days) => ({
        days,
        label: getRangeLabel(days),
        isActive: selectedDays === days,
      })),
      reportCtaLabel: data.reportCtaLabel,
    },
    cards: data.cards.map(toKpiCardViewModel),
    chartTitle: data.chart.title,
    chartPoints: data.chart.points.map(toChartPoint),
    chartLegends: defaultLegends,
    chartAnnotations: toChartAnnotations(data.chart.annotations),
    scenarioTitle: data.scenario.title,
    scenarioActionLabel: data.scenario.customizeCtaLabel,
    scenarios: data.scenario.scenarios.map(toScenarioCard),
    actionPlan: toActionPlan(data.actionPlan),
  }
}
