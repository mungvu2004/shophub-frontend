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
      subValueLabel: `KHOẢNG BIẾN ĐỘNG: ${toForecastRangeLabel(card.rangeMin, card.rangeMax)}`,
      confidencePercent: card.confidencePercent,
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

const toScenarioCard = (scenario: RevenueMlForecastScenario): RevenueMlForecastScenarioCardViewModel => {
  const statusMap: Record<string, string> = {
    'Optimistic': 'Lạc quan',
    'Baseline': 'Cơ sở',
    'Critical': 'Nguy cấp'
  }
  
  return {
    id: scenario.id,
    title: scenario.title,
    projectedRevenue: scenario.projectedRevenue,
    valueLabel: toCurrencyLabel(scenario.projectedRevenue),
    note: statusMap[scenario.note] || scenario.note,
    accent: scenario.accent,
    isRecommended: scenario.isRecommended,
  }
}

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
    color: '#64748b', // Slate 500
  },
  {
    id: 'forecast',
    label: 'Dự báo',
    type: 'dashed',
    color: '#4f46e5', // Indigo 600
  },
  {
    id: 'confidence',
    label: 'Độ tin cậy',
    type: 'block',
    color: '#e0e7ff', // Indigo 100
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
  // Defensive check for data object
  const safeData = data || {} as RevenueMlForecastResponse;
  const safeChart = safeData.chart || { title: 'Biểu đồ dự báo', points: [], annotations: [] };
  const safeScenario = safeData.scenario || { title: 'Kịch bản giả lập', customizeCtaLabel: 'Tùy chỉnh', scenarios: [] };
  const safeActionPlan = safeData.actionPlan || { title: '', steps: [], ctaLabel: '' };

  return {
    header: {
      title: safeData.title || 'Dự báo doanh thu',
      modelLabel: safeData.modelLabel || '',
      accuracyLabel: safeData.accuracyPercent ? `${Math.round(safeData.accuracyPercent * 10) / 10}%` : '0%',
      updateLabel: safeData.lastUpdatedLabel || '',
      rangeOptions: (safeData.rangeOptions || []).map((days) => ({
        days,
        label: getRangeLabel(days),
        isActive: selectedDays === days,
      })),
      reportCtaLabel: safeData.reportCtaLabel || 'Xem báo cáo',
    },
    cards: (safeData.cards || []).map(toKpiCardViewModel),
    chartTitle: safeChart.title || 'Biểu đồ dự báo',
    chartPoints: (safeChart.points || []).map(toChartPoint),
    chartLegends: defaultLegends,
    chartAnnotations: toChartAnnotations(safeChart.annotations || []),
    targetRevenue: safeData.targetRevenue || 0,
    gapToTarget: safeData.gapToTarget || 0,
    channelBreakdown: safeData.channelBreakdown || [],
    historicalMape: safeData.historicalMape || 0,
    keyDrivers: safeData.keyDrivers || [],
    scenarioTitle: safeScenario.title || 'Kịch bản giả lập',
    scenarioActionLabel: safeScenario.customizeCtaLabel || 'Tùy chỉnh',
    scenarios: (safeScenario.scenarios || []).map(toScenarioCard),
    actionPlan: toActionPlan(safeActionPlan),
    selectedDays,
  }
}
