export type ViewMode = 'table' | 'grid'

export type InventoryAdjustmentMovementType =
  | 'IMPORT'
  | 'MANUAL_ADJUSTMENT'
  | 'DAMAGE_LOSS'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'

export type InventoryPageHeaderTab = {
  id: ViewMode
  label: string
  icon?: string
}

export interface InventoryPageHeaderViewModel {
  selectedViewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  tabs: InventoryPageHeaderTab[]
  onAdjustStock?: () => void
  onExportData?: () => void
  onImportData?: () => void
}

export interface InventoryStockAdjustmentPayload {
  variantId: string
  warehouseId: string
  delta: number
  movementType: InventoryAdjustmentMovementType
  reason: string
  note?: string
}
