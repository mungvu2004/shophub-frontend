import { DollarSign, ShoppingCart, AlertCircle, BarChart3 } from 'lucide-react'
import type { MetricCardData } from '@/features/dashboard/logic/dashboardKpiOverview.types'

const SIGNAL_WIDTH = 60
const SIGNAL_HEIGHT = 24
const CIRCLE_SIZE = 46
const CIRCLE_STROKE = 5
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE) / 2
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

const iconMap: Record<string, typeof DollarSign> = {
  DollarSign,
  ShoppingCart,
  AlertCircle,
  BarChart3,
}

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
  const ratioPercent = Math.max(0, Math.min(100, metric.ratioPercent ?? 0))
  const isHighRate = ratioPercent >= 8
  const toneTextClass = isHighRate ? 'text-orange-700' : 'text-emerald-700'
  const toneTrackClass = isHighRate ? 'text-orange-100' : 'text-emerald-100'
  const toneFillClass = isHighRate ? 'text-orange-500' : 'text-emerald-500'
  const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - ratioPercent / 100)

  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0" style={{ width: `${CIRCLE_SIZE}px`, height: `${CIRCLE_SIZE}px` }}>
          <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`} aria-hidden>
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              className={toneTrackClass}
              fill="none"
              stroke="currentColor"
              strokeWidth={CIRCLE_STROKE}
            />
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              className={toneFillClass}
              fill="none"
              stroke="currentColor"
              strokeWidth={CIRCLE_STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className={`text-[10px] font-bold ${metric.isPlaceholder ? 'text-slate-400' : toneTextClass}`}>{ratioPercent.toFixed(1)}%</span>
          </div>
        </div>

        {item ? (
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">{item.label}</p>
            <p className={metric.isPlaceholder ? 'text-xs font-semibold text-slate-400' : 'text-xs font-semibold text-slate-700'}>{item.value}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

type KpiCardProps = {
  metric: MetricCardData & { isPlaceholder?: boolean }
}

export function KpiCard({ metric }: KpiCardProps) {
  const borderToneClass = metric.borderTone === 'warning' ? 'border-orange-100' : 'border-slate-100'
  const IconComponent = metric.iconName ? iconMap[metric.iconName] : null
  const isRefundRateCard = metric.id === 'refund-rate'

  return (
    <article
      className={`relative h-[234px] w-full max-w-[226px] overflow-hidden rounded-2xl border bg-white p-6 shadow-sm xl:max-w-none ${borderToneClass}`}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: metric.accentColor ?? '#EEF2FF' }}
        >
          {IconComponent ? (
            <IconComponent className="h-5 w-5 text-slate-700" />
          ) : null}
        </div>

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

      {!isRefundRateCard ? (
        <div className="pointer-events-none absolute bottom-4 right-6 flex justify-end" style={{ marginTop: `-${SIGNAL_HEIGHT / 2}px` }}>
          <SignalSparkline metric={metric} />
        </div>
      ) : null}
    </article>
  )
}
