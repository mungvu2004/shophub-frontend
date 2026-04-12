import type { InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'

export interface InventoryGridViewModel {
  rows: InventoryTableRow[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onCardAction?: (action: string, rowId: string) => void
  onOpenProductDetail?: (rowId: string, productId?: string) => void
  pageSizeOptions?: number[]
}
