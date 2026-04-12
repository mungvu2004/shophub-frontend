import type { MovementType } from '@/types/inventory.types'
import type { PlatformCode } from '@/types/platform.types'

export type InventoryStockMovementPlatformFilter = 'all' | PlatformCode

export type InventoryStockMovementGroupFilter = 'all' | 'inbound' | 'outbound' | 'transfer' | 'order' | 'adjustment' | 'loss'

export type InventoryStockMovementsQueryState = {
  search: string
  platform: InventoryStockMovementPlatformFilter
  movementGroup: InventoryStockMovementGroupFilter
  warehouseId: string
  page: number
  pageSize: number
}

export type InventoryStockMovementGroup = Exclude<InventoryStockMovementGroupFilter, 'all'>

export type InventoryStockMovementSummary = {
  totalMovements: number
  inboundQty: number
  outboundQty: number
  netQty: number
  lazadaMovements: number
  criticalSignals: number
}

export type InventoryStockMovementPlatformStat = {
  id: InventoryStockMovementPlatformFilter
  label: string
  count: number
  qtyDelta: number
}

export type InventoryStockMovementGroupStat = {
  id: InventoryStockMovementGroup
  label: string
  count: number
  tone: 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate'
}

export type InventoryStockMovementWarehouseStat = {
  id: string
  label: string
  count: number
  qtyDelta: number
}

export type InventoryStockMovementRecord = {
  id: number
  movementType: MovementType
  movementGroup: InventoryStockMovementGroup
  movementTypeLabel: string
  movementTone: 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate'
  platform: PlatformCode
  platformLabel: string
  warehouseId: string
  warehouseName: string
  sku: string
  productName: string
  variantName?: string
  imageUrl?: string
  delta: number
  deltaLabel: string
  qtyBefore: number
  qtyAfter: number
  reason?: string
  note?: string
  createdAt: string
  createdAtLabel: string
  createdByLabel: string
  refOrderItemId?: string
}

export type InventoryStockMovementDayGroup = {
  dateLabel: string
  items: InventoryStockMovementRecord[]
}

export type InventoryStockMovementsResponse = {
  title: string
  subtitle: string
  updatedAt: string
  summary: InventoryStockMovementSummary
  platformBreakdown: InventoryStockMovementPlatformStat[]
  groupBreakdown: InventoryStockMovementGroupStat[]
  warehouseBreakdown: InventoryStockMovementWarehouseStat[]
  movements: InventoryStockMovementRecord[]
  totalCount: number
  suggestedActionLabel: string
  lazadaNote: string
}

export type InventoryStockMovementSummaryCardViewModel = {
  id: string
  label: string
  value: string
  helperText: string
  tone: 'emerald' | 'amber' | 'indigo' | 'rose'
}

export type InventoryStockMovementPlatformViewModel = InventoryStockMovementPlatformStat & {
  percentage: number
}

export type InventoryStockMovementGroupViewModel = InventoryStockMovementGroupStat

export type InventoryStockMovementWarehouseViewModel = InventoryStockMovementWarehouseStat & {
  percentage: number
}

export type InventoryStockMovementsViewModel = {
  title: string
  subtitle: string
  updatedAtLabel: string
  suggestedActionLabel: string
  lazadaNote: string
  summaryCards: InventoryStockMovementSummaryCardViewModel[]
  platformStats: InventoryStockMovementPlatformViewModel[]
  groupStats: InventoryStockMovementGroupViewModel[]
  warehouseStats: InventoryStockMovementWarehouseViewModel[]
  movementGroups: InventoryStockMovementDayGroup[]
  totalCount: number
  page: number
  pageSize: number
  query: InventoryStockMovementsQueryState
  selectedMovement: InventoryStockMovementRecord | null
  warehouseOptions: Array<{ id: string; label: string }>
  platformOptions: Array<{ id: InventoryStockMovementPlatformFilter; label: string }>
  groupOptions: Array<{ id: InventoryStockMovementGroupFilter; label: string }>
}