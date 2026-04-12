import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

type TimelinePoint = {
  weekLabel: string
  score: number
  note?: string
  scoreLabel?: string
}

type SentimentAnalysisTimelineCardProps = {
  title: string
  description: string
  annotationLabel: string
  legend: Array<{ id: string; label: string; toneClass: string }>
  points: TimelinePoint[]
  selectedWeek: string
  onSelectWeek: (weekLabel: string) => void
}

const SVG_WIDTH = 760
const SVG_HEIGHT = 244
const PADDING_X = 24
const PADDING_TOP = 20
const PADDING_BOTTOM = 40

export function SentimentAnalysisTimelineCard({
  title,
  description,
  annotationLabel,
  legend,
  points,
  selectedWeek,
  onSelectWeek,
}: SentimentAnalysisTimelineCardProps) {
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null)

  const { coordinates, linePath, areaPath, highlightedPoint } = useMemo(() => {
    const scores = points.map((point) => point.score)
    const minScore = Math.min(...scores) - 4
    const maxScore = Math.max(...scores) + 4
    const chartHeight = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM
    const chartWidth = SVG_WIDTH - PADDING_X * 2
    const step = points.length > 1 ? chartWidth / (points.length - 1) : chartWidth

    const scoreRange = maxScore - minScore || 1

    const nextCoordinates = points.map((point, index) => {
      const x = PADDING_X + index * step
      const ratio = (point.score - minScore) / scoreRange
      const y = PADDING_TOP + chartHeight - ratio * chartHeight

      return { ...point, x, y }
    })

    const nextLinePath = nextCoordinates
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')

    const lastCoordinate = nextCoordinates[nextCoordinates.length - 1]
    const firstCoordinate = nextCoordinates[0]
    const nextAreaPath = `${nextLinePath} L ${lastCoordinate?.x ?? PADDING_X} ${SVG_HEIGHT - PADDING_BOTTOM} L ${firstCoordinate?.x ?? PADDING_X} ${SVG_HEIGHT - PADDING_BOTTOM} Z`
    const nextHighlightedPoint = nextCoordinates.find((point) => point.note) ?? nextCoordinates[Math.floor(nextCoordinates.length / 2)]

    return {
      coordinates: nextCoordinates,
      linePath: nextLinePath,
      areaPath: nextAreaPath,
      highlightedPoint: nextHighlightedPoint,
    }
  }, [points])

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] xl:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-[#111c2d]">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          {legend.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]', item.toneClass)} />
              <span className="text-[#111c2d]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectWeek('all')}
          className={cn(
            'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
            selectedWeek === 'all' ? 'bg-[#4f46e5] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          Tất cả tuần
        </button>

        {points.map((point) => (
          <button
            key={`${point.weekLabel}-chip`}
            type="button"
            onClick={() => onSelectWeek(point.weekLabel)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
              selectedWeek === point.weekLabel
                ? 'bg-[#4f46e5] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {point.weekLabel}
          </button>
        ))}
      </div>

      <div className="relative mt-4 h-[280px] overflow-hidden rounded-[22px] border-b border-slate-200 bg-gradient-to-b from-transparent to-slate-50/60">
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="sentiment-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#sentiment-area)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="450ms" fill="freeze" />
          </path>
          <path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset="100"
          >
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="700ms" fill="freeze" />
          </path>

          {coordinates.map((point, index) => {
            const isActive = selectedWeek === point.weekLabel || point.note
            const isHovered = hoveredWeek === point.weekLabel
            const pointRadius = isActive ? 7 : 5

            return (
            <g
              key={point.weekLabel}
              onMouseEnter={() => setHoveredWeek(point.weekLabel)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              {isHovered ? <circle cx={point.x} cy={point.y} r={14} fill="#4f46e5" opacity="0.14" /> : null}
              <circle
                role="button"
                tabIndex={0}
                cx={point.x}
                cy={point.y}
                r={pointRadius}
                fill={isActive ? '#4f46e5' : '#eef2ff'}
                stroke={isActive ? '#e0e7ff' : '#c7d2fe'}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectWeek(point.weekLabel)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectWeek(point.weekLabel)
                  }
                }}
              >
                <animate
                  attributeName="r"
                  from="0"
                  to={`${pointRadius}`}
                  dur="360ms"
                  begin={`${index * 50}ms`}
                  fill="freeze"
                />
              </circle>
            </g>
          )})}
        </svg>

        {highlightedPoint?.note ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2"
            style={{ left: `${highlightedPoint.x}px`, top: `${Math.max(highlightedPoint.y - 74, 18)}px` }}
          >
            <div className="relative rounded-xl bg-[#4f46e5] px-4 py-3 text-center text-[11px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(199,210,254,1),0_4px_6px_-4px_rgba(199,210,254,1)]">
              <span>{annotationLabel}</span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-[#4f46e5]" />
            </div>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-4 text-[10px] font-semibold tracking-[0.08em] text-slate-400">
          {coordinates.map((point) => (
            <div key={point.weekLabel} className="flex w-full flex-col items-center">
              <span className={cn(point.note || selectedWeek === point.weekLabel ? 'text-[#4f46e5]' : 'text-slate-400')}>{point.weekLabel}</span>
              <span
                className={cn(
                  'mt-2 h-2 rounded-full bg-transparent',
                  point.note || selectedWeek === point.weekLabel ? 'w-24 border border-[#c7d2fe] bg-[#eef2ff]' : 'w-10',
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}