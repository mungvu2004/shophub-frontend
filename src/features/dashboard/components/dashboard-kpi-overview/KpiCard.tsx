import type { MetricCardData } from '@/features/dashboard/logic/dashboardKpiOverview.types'

const SIGNAL_WIDTH = 60
const SIGNAL_HEIGHT = 24

function toneStyles(tone?: MetricCardData['changeTone']) {
  if (tone === 'positive') return 'bg-emerald-50 text-emerald-600'
  if (tone === 'warning') return 'bg-orange-50 text-orange-600'
  return 'bg-slate-100 text-slate-600'
}

function signalColor(metric: MetricCardData) {
  return metric.signalTone === 'bad' ? '#F97316' : '#10B981'
}

function signalPath(metric: MetricCardData) {
  if (metric.id === 'placeholder-1') return 'M1 23L10 18L20 21L30 12L40 15L50 5L59 1'
  if (metric.id === 'placeholder-2') return 'M1 20L10 22L20 15L30 18L40 8L50 12L59 5'
  if (metric.id === 'placeholder-3') return 'M1 5L10 8L20 3L30 15L40 10L50 20L59 23'
  if (metric.id === 'placeholder-4') return 'M1 1L10 5L20 3L30 12L40 10L50 18L59 23'
  return 'M1 20L10 22L20 15L30 18L40 8L50 12L59 5'
}

function SignalSparkline({ metric }: { metric: MetricCardData }) {
  const stroke = signalColor(metric)
  const d = signalPath(metric)

  return (
    <svg width={SIGNAL_WIDTH} height={SIGNAL_HEIGHT} viewBox="0 0 60 24" fill="none" aria-hidden>
      <path d={d} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlatformSplitBreakdown({
  metric,
}: {
  metric: MetricCardData & { isPlaceholder?: boolean }
}) {
  const breakdown = metric.breakdown ?? []
  if (!breakdown.length) return null

  return (
    <div className="mt-5 overflow-x-auto border-t border-slate-100 pt-4">
      <div className="flex min-w-max items-start gap-4 whitespace-nowrap">
        {breakdown.map((item, index) => (
          <div key={`${metric.id}-${item.label}`} className="flex items-center gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
              <p className={metric.isPlaceholder ? 'text-sm font-semibold text-slate-400' : 'text-sm font-semibold text-slate-900'}>{item.value}</p>
            </div>
            {index < breakdown.length - 1 ? <span className="h-6 w-px bg-slate-200" aria-hidden /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertSummaryBreakdown({
  metric,
}: {
  metric: MetricCardData & { isPlaceholder?: boolean }
}) {
  const item = metric.breakdown?.[0]
  if (!item) return null

  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
      <div className="whitespace-nowrap">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
        <p className={metric.isPlaceholder ? 'text-sm font-semibold text-slate-400' : 'text-sm font-semibold text-orange-600'}>{item.value}</p>
      </div>
    </div>
  )
}

function RateCompareBreakdown({
  metric,
}: {
  metric: MetricCardData & { isPlaceholder?: boolean }
}) {
  const item = metric.breakdown?.[0]
  const ratioPercent = metric.ratioPercent ?? 0

  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-orange-400 transition-[width] duration-300" style={{ width: `${ratioPercent}%` }} />
      </div>

      {item ? (
        <div className="whitespace-nowrap">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
          <p className={metric.isPlaceholder ? 'text-sm font-semibold text-slate-400' : 'text-sm font-semibold text-slate-700'}>{item.value}</p>
        </div>
      ) : null}
    </div>
  )
}

type KpiCardProps = {
  metric: MetricCardData & { isPlaceholder?: boolean }
}

export function KpiCard({ metric }: KpiCardProps) {
  const borderToneClass = metric.borderTone === 'warning' ? 'border-orange-100' : 'border-slate-100'

  return (
    <article className={`relative h-[234px] w-full max-w-[226px] overflow-hidden rounded-2xl border bg-white p-6 shadow-sm xl:max-w-none ${borderToneClass}`}>
      <div className="flex items-center justify-between">
        <div
          className="h-10 w-10 rounded-xl"
          style={{ backgroundColor: metric.accentColor ?? '#EEF2FF' }}
          aria-hidden
        />

        {metric.changeLabel ? (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneStyles(metric.changeTone)}`}>
            {metric.changeLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-xs font-bold tracking-[0.12em] text-slate-500">{metric.title}</p>
        <p className={metric.isPlaceholder ? 'text-3xl font-bold text-slate-400' : 'text-3xl font-bold text-slate-900'}>{metric.value}</p>
      </div>

      {metric.placeholderLayout === 'alert-summary' ? <AlertSummaryBreakdown metric={metric} /> : null}
      {metric.placeholderLayout === 'rate-compare' ? <RateCompareBreakdown metric={metric} /> : null}
      {!metric.placeholderLayout || metric.placeholderLayout === 'platform-split' ? <PlatformSplitBreakdown metric={metric} /> : null}

      <div className="pointer-events-none absolute bottom-4 right-6 flex justify-end" style={{ marginTop: `-${SIGNAL_HEIGHT / 2}px` }}>
        <SignalSparkline metric={metric} />
      </div>
    </article>
  )
}
