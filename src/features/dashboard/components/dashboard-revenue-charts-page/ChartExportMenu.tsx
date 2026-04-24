import { Download } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RevenueChartExportFormat } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type ChartExportMenuProps = {
  label?: string
  onExport: (format: RevenueChartExportFormat) => void
}

export function ChartExportMenu({ label = 'Xuất', onExport }: ChartExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs font-bold text-secondary-700 transition hover:border-primary-300 hover:text-primary-700"
        >
          <Download className="h-3.5 w-3.5" />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onExport('csv')}>Tải CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('excel')}>Tải Excel (.xls)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
