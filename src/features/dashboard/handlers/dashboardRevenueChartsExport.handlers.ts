import { toast } from 'sonner'

import { buildRevenueExportPayload } from '@/features/dashboard/logic/dashboardRevenueChartsExport.logic'
import type {
  RevenueChartExportFormat,
  RevenueChartExportTarget,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

function triggerFileDownload(fileName: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function handleRevenueChartExport(input: {
  target: RevenueChartExportTarget
  format: RevenueChartExportFormat
  model: RevenueChartsViewModel
  selectedCategoryId: string | null
}) {
  const payload = buildRevenueExportPayload(input)

  triggerFileDownload(payload.fileName, payload.mimeType, payload.content)
  toast.success(`Đã xuất ${input.format.toUpperCase()} cho biểu đồ.`)
}
