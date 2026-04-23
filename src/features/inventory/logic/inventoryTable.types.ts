export type InventoryRowStatus = 'normal' | 'warning' | 'critical' | 'discontinued'
export type InventorySortDirection = 'asc' | 'desc'

export type InventorySortState = {
  columnId: string
  direction: InventorySortDirection
}

export interface InventoryTableColumn {
  id: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface InventoryTableRow {
  id: string
  productId?: string
  variantId?: string
  warehouseId?: string
  image?: string
  sku: string
  productName: string
  category: string
  platformType: string
  shopeeStock: number
  tiktokStock: number
  lazadaStock: number
  actualStock: number
  onOrder: number
  available: number
  status: InventoryRowStatus
  aiPrediction?: string
  restockDays?: string
  avgDailySales?: number
  forecastDays?: number
  isDiscontinued?: boolean
  maxCapacity?: number
}

export interface InventoryTableViewModel {
  columns: InventoryTableColumn[]
  rows: InventoryTableRow[]
  selectedRows: string[]
  isLoading: boolean
  onSelectRow: (rowId: string) => void
  onSelectAll: (selected: boolean) => void
  sortState?: InventorySortState
  onSortChange?: (state: InventorySortState) => void
  onEditRow?: (rowId: string, productId?: string) => void
  onDeleteRows?: (rowIds: string[]) => void
  onBulkAdjust?: () => void
  // Pagination
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  onOpenProductDetail?: (rowId: string, productId?: string) => void
}
