import { InventoryPageHeader } from '@/features/inventory/components/inventory-page-header/InventoryPageHeader'
import type { InventoryPageHeaderViewModel, ViewMode } from '@/features/inventory/logic/inventoryPageHeader.types'

type InventoryPageHeaderViewProps = {
  selectedViewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export function InventoryPageHeaderView({
  selectedViewMode = 'table',
  onViewModeChange,
}: InventoryPageHeaderViewProps) {
  const model: InventoryPageHeaderViewModel = {
    selectedViewMode,
    onViewModeChange: onViewModeChange || (() => {}),
    tabs: [
      { id: 'table', label: 'Bảng' },
      { id: 'grid', label: 'Lưới' },
    ],
  }

  return <InventoryPageHeader model={model} />
}
