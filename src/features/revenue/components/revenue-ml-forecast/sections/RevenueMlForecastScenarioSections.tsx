import { AlertTriangle, CalendarDays, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  RevenueMlForecastActionPlanViewModel,
  RevenueMlForecastScenarioCardViewModel,
} from '@/features/revenue/logic/revenueMlForecast.types'
import { cn } from '@/lib/utils'

export function RevenueMlForecastScenarioSection({
  title,
  actionLabel,
  scenarios,
  selectedScenarioId,
  onScenarioChange,
  compact = false,
}: {
  title: string
  actionLabel: string
  scenarios: RevenueMlForecastScenarioCardViewModel[]
  selectedScenarioId: string | null
  onScenarioChange: (scenarioId: string) => void
  compact?: boolean
}) {
  const scenarioPriorityByAccent: Record<RevenueMlForecastScenarioCardViewModel['accent'], number> = {
    positive: 0,
    neutral: 1,
    negative: 2,
  }

  const orderedScenarios = [...scenarios].sort((left, right) => {
    const priorityDelta = scenarioPriorityByAccent[left.accent] - scenarioPriorityByAccent[right.accent]

    if (priorityDelta !== 0) {
      return priorityDelta
    }

    return right.projectedRevenue - left.projectedRevenue
  })

  return (
    <section className={cn('rounded-2xl border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]', compact ? 'p-4' : 'p-5')}>
      <div className={cn('flex flex-wrap items-center justify-between gap-3', compact ? 'mb-4' : 'mb-5')}>
        <div>
          <h2 className={cn('font-bold text-slate-900', compact ? 'text-[20px]' : 'text-[21px]')}>{title}</h2>
          <p className={cn('mt-1 text-slate-500', compact ? 'text-[12px]' : 'text-[13px]')}>Chọn một kịch bản để xem trước đường dự báo ở biểu đồ bên dưới.</p>
        </div>
        <Button
          variant="ghost"
          className={cn('h-auto px-0 py-0 font-semibold text-[#3525cd] hover:bg-transparent gap-2', compact ? 'text-[11px]' : 'text-[12px]')}
        >
          <Sparkles className="size-3.5" />
          {actionLabel}
        </Button>
      </div>

      <div className={cn('grid gap-3', compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3')}>
        {orderedScenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onScenarioChange(scenario.id)}
            className={cn(
              'min-w-0 text-left rounded-xl border-2 px-4 py-4 transition-all duration-200 group',
              scenario.id === selectedScenarioId
                ? 'border-[#3525cd] bg-gradient-to-br from-[#eef0ff] to-[#f7f8ff] shadow-[0_10px_24px_rgba(53,37,205,0.16)] scale-[1.01]'
                : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {scenario.isRecommended ? (
                  <span className="mb-3 inline-flex rounded-full bg-[#3525cd] px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-[0.5px]">
                    ⭐ Được khuyến nghị
                  </span>
                ) : null}
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">{scenario.title}</p>
              </div>
              <span
                className={cn(
                  'inline-flex size-4 shrink-0 rounded-full border-2 group-hover:scale-110 transition-transform',
                  scenario.accent === 'positive'
                    ? 'border-emerald-500 bg-emerald-400'
                    : scenario.accent === 'negative'
                    ? 'border-rose-500 bg-rose-400'
                    : 'border-amber-500 bg-amber-400',
                )}
              />
            </div>
            <p
              className={cn(
                'mt-3 break-words font-bold leading-tight tracking-[-0.3px]',
                compact ? 'text-[24px]' : 'text-[28px]',
                scenario.accent === 'negative'
                  ? 'text-rose-600'
                  : scenario.accent === 'positive'
                  ? 'text-emerald-600'
                  : 'text-[#3525cd]',
              )}
            >
              {scenario.valueLabel}
            </p>
            <p className={cn('mt-3 text-slate-600 leading-relaxed', compact ? 'text-[12px]' : 'text-[13px]')}>{scenario.note}</p>
            {scenario.id === selectedScenarioId ? (
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-[#3525cd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.8px] text-white">
                  ✓ Đang hiển thị
                </span>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  )
}

export function RevenueMlForecastActionPlanSection({
  actionPlan,
  selectedScenario,
}: {
  actionPlan: RevenueMlForecastActionPlanViewModel
  selectedScenario: RevenueMlForecastScenarioCardViewModel | null
}) {
  const toneClassName =
    selectedScenario?.accent === 'positive'
      ? 'from-emerald-500 to-emerald-700'
      : selectedScenario?.accent === 'negative'
      ? 'from-rose-500 to-rose-700'
      : 'from-amber-500 to-amber-700'

  return (
    <section className={cn('rounded-2xl bg-gradient-to-br px-5 py-5 text-white shadow-[0_12px_36px_rgba(53,37,205,0.22)]', toneClassName)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 text-white/80 shrink-0" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-white/75">Smart Alerts</p>
          <h3 className="mt-1 text-[19px] font-bold leading-tight">{actionPlan.title}</h3>
          {selectedScenario ? <p className="mt-2 text-sm text-white/80">Đang áp dụng kịch bản: {selectedScenario.title}</p> : null}
        </div>
      </div>

      <ol className="mt-4 space-y-3">
        {actionPlan.steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 text-[12.5px] leading-relaxed text-white/90">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <Button className="mt-4 h-9 w-full rounded-lg bg-white text-[12px] font-bold text-[#3525cd] hover:bg-indigo-50 shadow-[0_4px_12px_rgba(255,255,255,0.18)]">
        <CalendarDays className="size-4" />
        {actionPlan.ctaLabel}
      </Button>
    </section>
  )
}

/**
 * Scenario Selection Tabs - Compact horizontal version displayed at top
 */
export function RevenueMlForecastScenarioTabsSection({
  scenarios,
  selectedScenarioId,
  onScenarioChange,
}: {
  scenarios: RevenueMlForecastScenarioCardViewModel[]
  selectedScenarioId: string | null
  onScenarioChange: (scenarioId: string) => void
}) {
  const scenarioPriorityByAccent: Record<RevenueMlForecastScenarioCardViewModel['accent'], number> = {
    positive: 0,
    neutral: 1,
    negative: 2,
  }

  const orderedScenarios = [...scenarios].sort((left, right) => {
    const priorityDelta = scenarioPriorityByAccent[left.accent] - scenarioPriorityByAccent[right.accent]

    if (priorityDelta !== 0) {
      return priorityDelta
    }

    return right.projectedRevenue - left.projectedRevenue
  })

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
      {orderedScenarios.map((scenario) => (
        <button
          key={scenario.id}
          type="button"
          onClick={() => onScenarioChange(scenario.id)}
          className={cn(
            'min-w-0 text-left rounded-xl border-2 px-3 py-3 transition-all duration-200 group',
            scenario.id === selectedScenarioId
              ? 'border-[#3525cd] bg-gradient-to-br from-[#eef0ff] to-[#f7f8ff] shadow-[0_10px_24px_rgba(53,37,205,0.16)]'
              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {scenario.isRecommended ? (
                <span className="mb-2 inline-flex rounded-full bg-[#3525cd] px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-[0.5px]">
                  ⭐ Khuyến nghị
                </span>
              ) : null}
              <p className="text-[9px] font-bold uppercase tracking-[0.8px] text-slate-500">{scenario.title}</p>
            </div>
            <span
              className={cn(
                'inline-flex size-3.5 shrink-0 rounded-full border-2 group-hover:scale-110 transition-transform',
                scenario.accent === 'positive'
                  ? 'border-emerald-500 bg-emerald-400'
                  : scenario.accent === 'negative'
                  ? 'border-rose-500 bg-rose-400'
                  : 'border-amber-500 bg-amber-400',
              )}
            />
          </div>
          <p
            className={cn(
              'mt-2 break-words font-bold leading-tight tracking-[-0.2px] text-[18px] sm:text-[20px]',
              scenario.accent === 'negative'
                ? 'text-rose-600'
                : scenario.accent === 'positive'
                ? 'text-emerald-600'
                : 'text-[#3525cd]',
            )}
          >
            {scenario.valueLabel}
          </p>
          <p className="mt-1.5 text-slate-600 leading-relaxed text-[11px] line-clamp-2">{scenario.note}</p>
        </button>
      ))}
    </div>
  )
}

/**
 * Smart Alerts Bottom Panel - Horizontal version displayed below chart
 */
export function RevenueMlForecastSmartAlertsBottomPanel({
  actionPlan,
  selectedScenario,
}: {
  actionPlan: RevenueMlForecastActionPlanViewModel
  selectedScenario: RevenueMlForecastScenarioCardViewModel | null
}) {
  const toneClassName =
    selectedScenario?.accent === 'positive'
      ? 'from-emerald-500 to-emerald-700'
      : selectedScenario?.accent === 'negative'
      ? 'from-rose-500 to-rose-700'
      : 'from-amber-500 to-amber-700'

  return (
    <section className={cn('rounded-2xl bg-gradient-to-br px-5 py-5 text-white shadow-[0_12px_36px_rgba(53,37,205,0.22)]', toneClassName)}>
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="mt-0.5 size-4 text-white/80 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-white/75">Smart Alerts</p>
          <h3 className="mt-1 text-[18px] font-bold leading-tight">{actionPlan.title}</h3>
          {selectedScenario ? <p className="mt-1 text-xs text-white/80">Kịch bản: {selectedScenario.title}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actionPlan.steps.map((step, index) => (
          <div key={step} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
              {index + 1}
            </span>
            <span className="text-[12px] leading-relaxed text-white/90">{step}</span>
          </div>
        ))}
      </div>

      <Button className="mt-4 h-9 rounded-lg bg-white text-[12px] font-bold text-[#3525cd] hover:bg-indigo-50 shadow-[0_4px_12px_rgba(255,255,255,0.18)]">
        <CalendarDays className="size-4" />
        {actionPlan.ctaLabel}
      </Button>
    </section>
  )
}
