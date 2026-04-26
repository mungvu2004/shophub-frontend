import { Button } from '@/components/ui/button'
import type { InventoryPageHeaderViewModel } from '@/features/inventory/logic/inventoryPageHeader.types'
import { Grid3X3, ListIcon, Settings, Download, Upload } from 'lucide-react'

type InventoryPageHeaderProps = {
  model: InventoryPageHeaderViewModel
}

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  table: Grid3X3,
  grid: ListIcon,
  adjust: Settings,
  export: Download,
  import: Upload,
}

export function InventoryPageHeader({ model }: InventoryPageHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white bg-abstract-geometric p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Tồn kho</h1>
        
        {/* View Toggle */}
        <div className="ml-4 inline-flex items-center gap-1 rounded-lg bg-indigo-50 p-1">
          {model.tabs.map((tab) => {
            const isActive = tab.id === model.selectedViewMode
            const IconComponent = iconMap[tab.id]

            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => model.onViewModeChange(tab.id)}
                className={isActive ? 'bg-indigo-600 text-white' : 'text-slate-600'}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span className="ml-1.5">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => model.onAdjustStock?.()}
          disabled={!model.onAdjustStock}
        >
          <Settings className="h-4 w-4" />
          <span className="ml-1.5">Điều chỉnh</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => model.onExportData?.()}
          disabled={!model.onExportData}
        >
          <Download className="h-4 w-4" />
          <span className="ml-1.5">Xuất kho</span>
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-indigo-600"
          onClick={() => model.onImportData?.()}
          disabled={!model.onImportData}
        >
          <Upload className="h-4 w-4" />
          <span className="ml-1.5">Nhập kho</span>
        </Button>
      </div>
    </div>
  )
}
