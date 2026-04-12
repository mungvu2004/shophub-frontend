import type { InventoryStockMovementsResponse } from '@/features/inventory/logic/inventoryStockMovements.types'
import type {
  InventoryStockMovementGroupStat,
  InventoryStockMovementPlatformStat,
  InventoryStockMovementRecord,
} from '@/features/inventory/logic/inventoryStockMovements.types'
import { mockStockLevels, mockStockMovements, mockWarehouses } from '@/mocks/data/inventory'
import type { MovementType } from '@/types/inventory.types'
import type { PlatformCode } from '@/types/platform.types'

const platformCycle: PlatformCode[] = ['shopee', 'lazada', 'tiktok_shop', 'lazada']

const movementGroupOrder = ['inbound', 'outbound', 'transfer', 'order', 'adjustment', 'loss'] as const

const movementTypeLabelMap: Record<MovementType, string> = {
  ORDER_RESERVE: 'Giữ đơn',
  ORDER_RELEASE: 'Giải phóng đơn',
  ORDER_FULFILL: 'Xuất đơn',
  RETURN_RECEIVED: 'Nhập hoàn',
  MANUAL_ADJUSTMENT: 'Điều chỉnh thủ công',
  IMPORT: 'Nhập hàng',
  DAMAGE_LOSS: 'Hao hụt / mất mát',
  TRANSFER_OUT: 'Điều chuyển ra',
  TRANSFER_IN: 'Điều chuyển vào',
}

const movementGroupLabelMap: Record<(typeof movementGroupOrder)[number], string> = {
  inbound: 'Nhập kho',
  outbound: 'Xuất kho',
  transfer: 'Điều chuyển',
  order: 'Đơn hàng',
  adjustment: 'Điều chỉnh',
  loss: 'Hao hụt',
}

function toMovementGroup(movementType: MovementType) {
  switch (movementType) {
    case 'IMPORT':
    case 'RETURN_RECEIVED':
      return 'inbound'
    case 'ORDER_FULFILL':
      return 'outbound'
    case 'TRANSFER_OUT':
    case 'TRANSFER_IN':
      return 'transfer'
    case 'ORDER_RESERVE':
    case 'ORDER_RELEASE':
      return 'order'
    case 'MANUAL_ADJUSTMENT':
      return 'adjustment'
    case 'DAMAGE_LOSS':
      return 'loss'
    default:
      return 'adjustment'
  }
}

function toMovementTone(group: keyof typeof movementGroupLabelMap) {
  switch (group) {
    case 'inbound':
      return 'emerald'
    case 'outbound':
      return 'rose'
    case 'transfer':
      return 'indigo'
    case 'order':
      return 'amber'
    case 'loss':
      return 'rose'
    default:
      return 'slate'
  }
}

const detailedMovements: InventoryStockMovementRecord[] = mockStockMovements.map((movement, index) => {
  const stockLevel = mockStockLevels.find((item) => item.variantId === movement.variantId)
  const warehouse = mockWarehouses.find((item) => item.id === movement.warehouseId)
  const platform = platformCycle[index % platformCycle.length]
  const movementGroup = toMovementGroup(movement.movementType) as InventoryStockMovementRecord['movementGroup']
  const createdAt = movement.createdAt.replace('Z', '+07:00')
  const timeLabel = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(createdAt))

  return {
    id: movement.id,
    movementType: movement.movementType,
    movementGroup,
    movementTypeLabel: movementTypeLabelMap[movement.movementType],
    movementTone: toMovementTone(movementGroup) as InventoryStockMovementRecord['movementTone'],
    platform,
    platformLabel: platform === 'lazada' ? 'Lazada' : platform === 'shopee' ? 'Shopee' : 'TikTok Shop',
    warehouseId: movement.warehouseId,
    warehouseName: warehouse?.name ?? 'Kho tổng',
    sku: stockLevel?.sku ?? movement.variantId.toUpperCase(),
    productName: stockLevel?.productName ?? `SKU ${movement.variantId}`,
    variantName: stockLevel?.variantName,
    imageUrl: stockLevel?.productImage,
    delta: movement.delta,
    deltaLabel: `${movement.delta > 0 ? '+' : ''}${movement.delta}`,
    qtyBefore: movement.qtyBefore,
    qtyAfter: movement.qtyAfter,
    reason: movement.reason,
    note: movement.note,
    createdAt,
    createdAtLabel: timeLabel,
    createdByLabel: movement.createdBy === 'system' ? 'Hệ thống' : 'Nhân viên kho',
    refOrderItemId: movement.refOrderItemId,
  }
})

function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.abs(value))
}

function buildSummary(items: typeof detailedMovements) {
  const totalMovements = items.length
  const inboundQty = items.filter((item) => item.delta > 0).reduce((sum, item) => sum + item.delta, 0)
  const outboundQty = items.filter((item) => item.delta < 0).reduce((sum, item) => sum + Math.abs(item.delta), 0)
  const netQty = items.reduce((sum, item) => sum + item.delta, 0)
  const lazadaMovements = items.filter((item) => item.platform === 'lazada').length
  const criticalSignals = items.filter((item) => item.movementGroup === 'loss' || item.delta < 0).length

  return { totalMovements, inboundQty, outboundQty, netQty, lazadaMovements, criticalSignals }
}

function buildPlatformBreakdown(items: typeof detailedMovements): InventoryStockMovementPlatformStat[] {
  const counts = {
    all: items.length,
    shopee: 0,
    lazada: 0,
    tiktok_shop: 0,
  }

  const qtyDelta = {
    shopee: 0,
    lazada: 0,
    tiktok_shop: 0,
  }

  items.forEach((item) => {
    if (item.platform !== 'shopee' && item.platform !== 'lazada' && item.platform !== 'tiktok_shop') return
    counts[item.platform] += 1
    qtyDelta[item.platform] += item.delta
  })

  return [
    { id: 'all' as const, label: 'Tất cả', count: counts.all, qtyDelta: items.reduce((sum, item) => sum + item.delta, 0) },
    { id: 'shopee' as const, label: 'Shopee', count: counts.shopee, qtyDelta: qtyDelta.shopee },
    { id: 'lazada' as const, label: 'Lazada', count: counts.lazada, qtyDelta: qtyDelta.lazada },
    { id: 'tiktok_shop' as const, label: 'TikTok Shop', count: counts.tiktok_shop, qtyDelta: qtyDelta.tiktok_shop },
  ]
}

function buildGroupBreakdown(items: typeof detailedMovements): InventoryStockMovementGroupStat[] {
  return movementGroupOrder.map((group) => ({
    id: group,
    label: movementGroupLabelMap[group],
    count: items.filter((item) => item.movementGroup === group).length,
    tone: toMovementTone(group) as InventoryStockMovementGroupStat['tone'],
  }))
}

function buildWarehouseBreakdown(items: typeof detailedMovements) {
  return mockWarehouses.map((warehouse) => ({
    id: warehouse.id,
    label: warehouse.name,
    count: items.filter((item) => item.warehouseId === warehouse.id).length,
    qtyDelta: items.filter((item) => item.warehouseId === warehouse.id).reduce((sum, item) => sum + item.delta, 0),
  }))
}

function matchesSearch(item: (typeof detailedMovements)[number], search: string) {
  if (!search) return true

  return [item.sku, item.productName, item.variantName ?? '', item.reason ?? '', item.note ?? '', item.warehouseName]
    .join(' ')
    .toLowerCase()
    .includes(search)
}

export function buildInventoryStockMovementsResponse(params: {
  search?: string
  platform?: PlatformCode
  movementGroup?: ReturnType<typeof toMovementGroup> | 'all'
  warehouseId?: string
  page?: number
  pageSize?: number
} = {}): InventoryStockMovementsResponse {
  const search = (params.search ?? '').trim().toLowerCase()

  const filtered = detailedMovements.filter((item) => {
    const matchSearch = matchesSearch(item, search)
    const matchPlatform = !params.platform || item.platform === params.platform
    const matchGroup = !params.movementGroup || params.movementGroup === 'all' || item.movementGroup === params.movementGroup
    const matchWarehouse = !params.warehouseId || item.warehouseId === params.warehouseId

    return matchSearch && matchPlatform && matchGroup && matchWarehouse
  })

  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.max(1, params.pageSize ?? 10)
  const start = (page - 1) * pageSize
  const paged = sorted.slice(start, start + pageSize)
  const summary = buildSummary(filtered)

  return {
    title: 'Nhập / Xuất kho',
    subtitle: 'Dòng chảy kho theo thời gian thực, có Lazada riêng và đủ dấu vết từng biến động',
    updatedAt: '14:35 hôm nay',
    summary,
    platformBreakdown: buildPlatformBreakdown(filtered).map((item) => ({ ...item, qtyDelta: item.qtyDelta })),
    groupBreakdown: buildGroupBreakdown(filtered),
    warehouseBreakdown: buildWarehouseBreakdown(filtered),
    movements: paged,
    totalCount: filtered.length,
    suggestedActionLabel: 'Đồng bộ Lazada ngay khi chênh lệch tồn xuất hiện',
    lazadaNote: `Lazada chiếm ${formatMoney(summary.lazadaMovements)} biến động trong tập dữ liệu hiện tại`,
  }
}
