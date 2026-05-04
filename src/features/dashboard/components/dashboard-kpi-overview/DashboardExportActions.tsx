import { FileImage, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { EXPORT_MESSAGES } from '@/features/dashboard/logic/dashboardKpiOverview.constants'

  // eslint-disable-next-line react-refresh/only-export-components
export function useDashboardExport() {
  const exportAsPDF = () => {
    toast.info(EXPORT_MESSAGES.PDF_PREPARING, {
      description: EXPORT_MESSAGES.PDF_INSTRUCTION,
    })
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const exportAsPNG = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: EXPORT_MESSAGES.PNG_LOADING,
      success: EXPORT_MESSAGES.PNG_SUCCESS,
      error: EXPORT_MESSAGES.PNG_ERROR,
      description: 'Tính năng xuất PNG đang được tối ưu hóa.',
    })
  }

  return { exportAsPDF, exportAsPNG }
}


type DashboardExportActionsProps = {
  isRefreshing?: boolean
}

export function DashboardExportActions({ isRefreshing }: DashboardExportActionsProps) {
  const { exportAsPDF, exportAsPNG } = useDashboardExport()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={exportAsPNG}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
      >
        <FileImage className="h-4 w-4 text-indigo-600" />
        <span>Xuất PNG</span>
      </button>
      <button
        type="button"
        onClick={exportAsPDF}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
      >
        <FileText className="h-4 w-4 text-emerald-600" />
        <span>Xuất PDF</span>
      </button>
    </div>
  )
}
