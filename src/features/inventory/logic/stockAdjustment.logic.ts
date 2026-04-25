import type { StockAdjustment, StockAdjustmentItem, StockAdjustmentViewModel } from './stockAdjustment.types'

export const APPROVAL_THRESHOLD = 50 // Ngưỡng điều chỉnh cần phê duyệt (ví dụ: > 50 đơn vị)

export function buildStockAdjustmentViewModel(adjustment: StockAdjustment, userRole: string): StockAdjustmentViewModel {
  const summary = adjustment.items.reduce(
    (acc, item) => {
      if (item.difference > 0) acc.increasedItems++
      else if (item.difference < 0) acc.decreasedItems--
      else acc.noChangeItems++
      return acc
    },
    { totalItems: adjustment.items.length, increasedItems: 0, decreasedItems: 0, noChangeItems: 0 }
  )

  return {
    adjustment,
    canApprove: adjustment.status === 'PENDING_APPROVAL' && userRole === 'ADMIN',
    canEdit: adjustment.status === 'DRAFT' || adjustment.status === 'PENDING_APPROVAL',
    summary
  }
}

export function calculateDifference(systemQty: number, actualQty: number): number {
  return actualQty - systemQty
}

export function checkRequiresApproval(items: StockAdjustmentItem[]): boolean {
  return items.some(item => Math.abs(item.difference) >= APPROVAL_THRESHOLD)
}

export function validateAdjustmentItem(item: Partial<StockAdjustmentItem>): string | null {
  if (item.actualQty === undefined || item.actualQty < 0) return 'Số lượng thực tế không hợp lệ'
  if (!item.reason) return 'Vui lòng chọn hoặc nhập lý do điều chỉnh'
  return null
}
