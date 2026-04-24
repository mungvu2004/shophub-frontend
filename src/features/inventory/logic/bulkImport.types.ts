import type { MovementType } from '@/types/inventory.types'

export interface BulkImportRow {
  sku: string
  productName: string
  warehouseHN: number
  warehouseHCM: number
  warehouseDN: number
  reason?: string
  note?: string
}

export interface BulkImportValidationError {
  row: number
  column: keyof BulkImportRow
  message: string
}

export interface BulkImportResult {
  successCount: number
  errorCount: number
  errors: BulkImportValidationError[]
  data: BulkImportRow[]
}

export interface BulkImportRequest {
  items: Array<{
    variantId: string
    sku: string
    warehouseId: string
    delta: number
    movementType: MovementType
    reason?: string
    note?: string
  }>
}
