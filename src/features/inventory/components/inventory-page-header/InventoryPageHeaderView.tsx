import { InventoryPageHeader } from '@/features/inventory/components/inventory-page-header/InventoryPageHeader'
import type { InventoryPageHeaderViewModel, ViewMode } from '@/features/inventory/logic/inventoryPageHeader.types'

type InventoryPageHeaderViewProps = {
  selectedViewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  onAdjustStock?: () => void
  onExportData?: () => void
  onImportData?: () => void
}

export function InventoryPageHeaderView({
  selectedViewMode = 'table',
  onViewModeChange,
  onAdjustStock,
  onExportData,
  onImportData,
}: InventoryPageHeaderViewProps) {
  const model: InventoryPageHeaderViewModel = {
    selectedViewMode,
    onViewModeChange: onViewModeChange || (() => {}),
    tabs: [
      { id: 'table', label: 'Bảng' },
      { id: 'grid', label: 'Lưới' },
    ],
    onAdjustStock,
    onExportData,
    onImportData,
  }

  return <InventoryPageHeader model={model} />
}
