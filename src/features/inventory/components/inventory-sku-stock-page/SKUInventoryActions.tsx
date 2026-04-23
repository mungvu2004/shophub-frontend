import { Settings, Download, Upload, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SKUInventoryActionsProps = {
  onAdjustStock?: () => void
  onExportData?: () => void
  onImportData?: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function SKUInventoryActions({
  onAdjustStock,
  onExportData,
  onImportData,
  onRefresh,
  isRefreshing = false,
}: SKUInventoryActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={onAdjustStock}
          className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
          disabled={!onAdjustStock}
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Điều chỉnh tồn kho</span>
          <span className="sm:hidden">Điều chỉnh</span>
        </Button>

        <Button
          variant="outline"
          onClick={onExportData}
          disabled={!onExportData}
          className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Xuất CSV</span>
          <span className="sm:hidden">Xuất</span>
        </Button>

        <Button
          variant="outline"
          onClick={onImportData}
          disabled={!onImportData}
          className="gap-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Nhập dữ liệu</span>
          <span className="sm:hidden">Nhập</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={!onRefresh || isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
        </Button>
      </div>
    </div>
  )
}
