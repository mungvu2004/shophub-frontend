export type ViewMode = 'table' | 'grid'

export type InventoryPageHeaderTab = {
  id: ViewMode
  label: string
  icon?: string
}

export interface InventoryPageHeaderViewModel {
  selectedViewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  tabs: InventoryPageHeaderTab[]
}
