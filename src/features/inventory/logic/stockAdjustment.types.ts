export type AdjustmentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'DRAFT'

export interface StockAdjustmentItem {
  id: string
  stockLevelId: string
  sku: string
  productName: string
  variantName?: string
  warehouseName: string
  systemQty: number
  actualQty: number
  difference: number
  reason: string
  note?: string
}

export interface StockAdjustment {
  id: string
  code: string // Ví dụ: ADJ-20240425-001
  status: AdjustmentStatus
  items: StockAdjustmentItem[]
  totalDifference: number
  requiresApproval: boolean
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  type: 'MANUAL' | 'CYCLE_COUNT' | 'BULK_IMPORT'
}

export interface StockAdjustmentViewModel {
  adjustment: StockAdjustment
  canApprove: boolean
  canEdit: boolean
  summary: {
    totalItems: number
    increasedItems: number
    decreasedItems: number
    noChangeItems: number
  }
}

export interface CycleCountSession {
  id: string
  warehouseId: string
  startedAt: string
  status: 'IN_PROGRESS' | 'COMPLETED'
  countedItems: Record<string, number> // variantId -> qty
}
