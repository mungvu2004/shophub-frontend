import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import type {
  RevenueChartExportFormat,
  RevenueChartsHeatmapCellViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueOrderHeatmapCardProps = {
  title: string
  cells: RevenueChartsHeatmapCellViewModel[]
  onExport: (format: RevenueChartExportFormat) => void
}

const dayOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const hourTicks = ['00h', '04h', '08h', '12h', '16h', '20h']

const toHeatColor = (intensity: number) => {
  if (intensity > 0.8) return 'oklch(0.64 0.18 264)'
  if (intensity > 0.6) return 'oklch(0.72 0.14 258)'
  if (intensity > 0.4) return 'oklch(0.8 0.11 252)'
  if (intensity > 0.2) return 'oklch(0.89 0.06 248)'
  return 'oklch(0.95 0.03 244)'
}

export function RevenueOrderHeatmapCard({ title, cells, onExport }: RevenueOrderHeatmapCardProps) {
  const groupedByDay = dayOrder.map((dayLabel) => ({
    dayLabel,
    cells: cells.filter((cell) => cell.dayLabel === dayLabel).sort((a, b) => a.hour - b.hour),
  }))

  return (
    <section className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-secondary-900 tracking-tight">{title}</h3>
          <p className="mt-1 text-xs text-secondary-500">Grid 7 x 24 cho mật độ đơn hàng theo từng khung giờ.</p>
        </div>
        <ChartExportMenu label="Xuất heatmap" onExport={onExport} />
      </header>

      <div className="overflow-x-auto">
        <div className="min-w-[760px] rounded-xl border border-secondary-100 p-3">
          <div className="mb-2 grid grid-cols-[60px_repeat(24,minmax(20px,1fr))] gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Ngày</span>
            {Array.from({ length: 24 }, (_, hour) => (
              <span
                key={`hour-${hour}`}
                className={`text-center text-[10px] font-semibold ${hourTicks.includes(`${`${hour}`.padStart(2, '0')}h`) ? 'text-secondary-600' : 'text-secondary-300'}`}
              >
                {hourTicks.includes(`${`${hour}`.padStart(2, '0')}h`) ? `${`${hour}`.padStart(2, '0')}` : ''}
              </span>
            ))}
          </div>

          <div className="space-y-1">
            {groupedByDay.map((dayRow) => (
              <div key={dayRow.dayLabel} className="grid grid-cols-[60px_repeat(24,minmax(20px,1fr))] gap-1">
                <span className="self-center text-[11px] font-bold text-secondary-600">{dayRow.dayLabel}</span>
                {dayRow.cells.map((cell) => (
                  <div
                    key={cell.id}
                    title={`${cell.dayLabel} ${cell.hourLabel}: ${cell.orderCount} đơn`}
                    className="h-5 rounded-[6px] transition-transform hover:scale-105"
                    style={{ backgroundColor: toHeatColor(cell.intensity) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-secondary-500">
          <span>Thấp</span>
          <span className="h-2 w-6 rounded" style={{ backgroundColor: toHeatColor(0.1) }} />
          <span className="h-2 w-6 rounded" style={{ backgroundColor: toHeatColor(0.4) }} />
          <span className="h-2 w-6 rounded" style={{ backgroundColor: toHeatColor(0.7) }} />
          <span className="h-2 w-6 rounded" style={{ backgroundColor: toHeatColor(1) }} />
          <span>Cao</span>
        </div>
      </div>
    </section>
  )
}
