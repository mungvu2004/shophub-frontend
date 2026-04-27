import { Button } from '@/components/ui/button'
import type { InventoryPageHeaderViewModel } from '@/features/inventory/logic/inventoryPageHeader.types'
import { Grid3X3, ListIcon, Settings, Download, Upload, Package } from 'lucide-react'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

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
    <ThemedPageHeader
      title="Quản lý Tồn kho"
      subtitle="Theo dõi và điều chỉnh hàng hóa trên tất cả các sàn"
      theme="inventory"
      badge={{ text: 'Inventory', icon: <Package className="size-3.5" /> }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
        {/* View Toggle */}
        <div className="inline-flex items-center gap-1 rounded-xl bg-white/80 p-1 backdrop-blur shadow-sm border border-emerald-200/50">
          {model.tabs.map((tab) => {
            const isActive = tab.id === model.selectedViewMode
            const IconComponent = iconMap[tab.id]

            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => model.onViewModeChange(tab.id)}
                className={isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:text-emerald-700 hover:bg-white'}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span className="ml-1.5">{tab.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 rounded-xl bg-white/80 backdrop-blur border-emerald-200/50 text-emerald-900 font-bold shadow-sm hover:bg-white"
            onClick={() => model.onAdjustStock?.()}
            disabled={!model.onAdjustStock}
          >
            <Settings className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Điều chỉnh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 rounded-xl bg-white/80 backdrop-blur border-emerald-200/50 text-emerald-900 font-bold shadow-sm hover:bg-white"
            onClick={() => model.onExportData?.()}
            disabled={!model.onExportData}
          >
            <Download className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Xuất kho</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="h-9 rounded-xl bg-emerald-600 shadow-sm text-white hover:bg-emerald-700 font-bold"
            onClick={() => model.onImportData?.()}
            disabled={!model.onImportData}
          >
            <Upload className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Nhập kho</span>
          </Button>
        </div>
      </div>
    </ThemedPageHeader>
  )
}
