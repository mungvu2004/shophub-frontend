import type { RevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.types'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
import {
  RevenueMlForecastChartSection,
  RevenueMlForecastHeaderSection,
  RevenueMlForecastHeadlineCardsSection,
  RevenueMlForecastScenarioSection,
} from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastSections'

export function RevenueMlForecastView({
  model,
  onRangeChange,
}: {
  model: RevenueMlForecastViewModel
  onRangeChange: (days: RevenueMlForecastRangeDays) => void
}) {
  return (
    <div className="space-y-7">
      <RevenueMlForecastHeaderSection model={model.header} onRangeChange={onRangeChange} />
      <RevenueMlForecastHeadlineCardsSection cards={model.cards} />
      <RevenueMlForecastChartSection
        title={model.chartTitle}
        points={model.chartPoints}
        legends={model.chartLegends}
        annotations={model.chartAnnotations}
      />
      <RevenueMlForecastScenarioSection
        title={model.scenarioTitle}
        actionLabel={model.scenarioActionLabel}
        scenarios={model.scenarios}
        actionPlan={model.actionPlan}
      />
    </div>
  )
}
