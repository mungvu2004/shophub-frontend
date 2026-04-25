import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import { HEATMAP_COLORS } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
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
  if (intensity > 0.8) return HEATMAP_COLORS.HIGH
  if (intensity > 0.6) return HEATMAP_COLORS.MEDIUM_HIGH
  if (intensity > 0.4) return HEATMAP_COLORS.MEDIUM
  if (intensity > 0.2) return HEATMAP_COLORS.MEDIUM_LOW
  return HEATMAP_COLORS.LOW
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
        <ChartExportMenu label="Xuất biểu đồ" onExport={onExport} />
      </header>

      <div className="overflow-x-auto">
        <div className="min-w-[760px] rounded-xl border border-secondary-100 p-3 bg-secondary-50/30">
          <div className="mb-3 grid grid-cols-[60px_repeat(24,minmax(20px,1fr))] gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Ngày</span>
            {Array.from({ length: 24 }, (_, hour) => (
              <span
                key={`hour-${hour}`}
                className={`text-center text-[10px] font-bold ${hourTicks.includes(`${`${hour}`.padStart(2, '0')}h`) ? 'text-secondary-600' : 'text-secondary-300'}`}
              >
                {hourTicks.includes(`${`${hour}`.padStart(2, '0')}h`) ? `${`${hour}`.padStart(2, '0')}` : ''}
              </span>
            ))}
          </div>

          <div className="space-y-1.5">
            {groupedByDay.map((dayRow) => (
              <div key={dayRow.dayLabel} className="grid grid-cols-[60px_repeat(24,minmax(20px,1fr))] gap-1.5">
                <span className="self-center text-[11px] font-bold text-secondary-600">{dayRow.dayLabel}</span>
                {dayRow.cells.map((cell) => (
                  <div
                    key={cell.id}
                    title={`${cell.dayLabel} ${cell.hourLabel}: ${cell.orderCount} đơn`}
                    className="h-5 rounded-[4px] transition-all hover:scale-110 cursor-pointer shadow-sm hover:z-10 hover:shadow-md"
                    style={{ backgroundColor: toHeatColor(cell.intensity) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-secondary-500 uppercase tracking-tight">
          <span>Thấp</span>
          <div className="flex gap-1">
            <span className="h-3 w-6 rounded-sm shadow-sm" style={{ backgroundColor: HEATMAP_COLORS.LOW }} />
            <span className="h-3 w-6 rounded-sm shadow-sm" style={{ backgroundColor: HEATMAP_COLORS.MEDIUM_LOW }} />
            <span className="h-3 w-6 rounded-sm shadow-sm" style={{ backgroundColor: HEATMAP_COLORS.MEDIUM }} />
            <span className="h-3 w-6 rounded-sm shadow-sm" style={{ backgroundColor: HEATMAP_COLORS.MEDIUM_HIGH }} />
            <span className="h-3 w-6 rounded-sm shadow-sm" style={{ backgroundColor: HEATMAP_COLORS.HIGH }} />
          </div>
          <span>Cao</span>
        </div>
        <p className="text-[10px] font-medium text-secondary-400 italic">* Hover vào từng ô để xem chi tiết</p>
      </div>
    </section>
  )
}
