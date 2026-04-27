import { useMemo, useState, memo } from 'react'
import { LineChart, Calendar } from 'lucide-react'
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
  legend: Array<{ id: string; label: string; toneClass: string }>
  points: TimelinePoint[]
  selectedWeek: string
  onSelectWeek: (weekLabel: string) => void
  className?: string
}

const SVG_WIDTH = 800
const SVG_HEIGHT = 220
const PADDING_X = 40
const PADDING_TOP = 20
const PADDING_BOTTOM = 40

export const SentimentAnalysisTimelineCard = memo(function SentimentAnalysisTimelineCard({
  title,
  description,
  legend,
  points,
  selectedWeek,
  onSelectWeek,
  className,
}: SentimentAnalysisTimelineCardProps) {
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null)

  const { coordinates, linePath, areaPath } = useMemo(() => {
    if (!points.length) return { coordinates: [], linePath: '', areaPath: '' }

    const scores = points.map((point) => point.score)
    const minScore = Math.min(...scores, 0) // Base at 0 for better context
    const maxScore = Math.max(...scores, 100)
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
    const nextAreaPath = `${nextLinePath} L ${lastCoordinate.x} ${SVG_HEIGHT - PADDING_BOTTOM} L ${firstCoordinate.x} ${SVG_HEIGHT - PADDING_BOTTOM} Z`

    return {
      coordinates: nextCoordinates,
      linePath: nextLinePath,
      areaPath: nextAreaPath,
    }
  }, [points])

  return (
    <section
      className={cn('overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <LineChart className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
            {legend.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <div className={cn('size-1.5 rounded-full', item.toneClass)} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => onSelectWeek('all')}
              className={cn(
                'rounded-md px-3 py-1.5 text-[10px] font-bold uppercase transition-all',
                selectedWeek === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600',
              )}
            >
              Tất cả
            </button>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1 px-1">
              <Calendar className="size-3 text-slate-300" />
              {points.map((p) => (
                <button
                  key={p.weekLabel}
                  type="button"
                  onClick={() => onSelectWeek(p.weekLabel)}
                  className={cn(
                    'rounded-md px-2 py-1.5 text-[10px] font-bold transition-all',
                    selectedWeek === p.weekLabel ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600',
                  )}
                >
                  {p.weekLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[240px] w-full select-none">
        <svg className="h-full w-full" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sentiment-line-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <line
              key={v}
              x1={PADDING_X}
              y1={PADDING_TOP + (SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * v}
              x2={SVG_WIDTH - PADDING_X}
              y2={PADDING_TOP + (SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM) * v}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          ))}

          <path d={areaPath} fill="url(#sentiment-line-gradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coordinates.map((point) => {
            const isActive = selectedWeek === point.weekLabel || point.note
            const isHovered = hoveredWeek === point.weekLabel

            return (
              <g
                key={point.weekLabel}
                onMouseEnter={() => setHoveredWeek(point.weekLabel)}
                onMouseLeave={() => setHoveredWeek(null)}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectWeek(point.weekLabel)
                }}
              >
                {/* Invisible larger hit area for better UX */}
                <circle cx={point.x} cy={point.y} r={20} fill="transparent" />
                
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 5 : 3.5}
                  fill={isActive ? '#4f46e5' : 'white'}
                  stroke="#4f46e5"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                {(isHovered || isActive) && (
                   <circle cx={point.x} cy={point.y} r={12} fill="#4f46e5" opacity="0.05" className="animate-pulse" />
                )}
              </g>
            )
          })}
        </svg>

        {/* Labels at bottom */}
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-[40px] text-[9px] font-black uppercase tracking-widest text-slate-400">
          {points.map((p) => (
            <span key={p.weekLabel} className={cn(selectedWeek === p.weekLabel && 'text-indigo-600')}>
              {p.weekLabel}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
})
