export type InventoryRowStatus = 'normal' | 'warning' | 'critical'

export interface InventoryTableColumn {
  id: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface InventoryTableRow {
  id: string
  productId?: string
  image?: string
  sku: string
  productName: string
  category: string
  shopeeStock: number
  tiktokStock: number
  lazadaStock: number
  actualStock: number
  onOrder: number
  available: number
  status: InventoryRowStatus
  aiPrediction?: string
  restockDays?: string
}

export interface InventoryTableViewModel {
  columns: InventoryTableColumn[]
  rows: InventoryTableRow[]
  selectedRows: string[]
  isLoading: boolean
  onSelectRow: (rowId: string) => void
  onSelectAll: (selected: boolean) => void
  onSort?: (columnId: string) => void
  // Pagination
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  onOpenProductDetail?: (rowId: string, productId?: string) => void
}
