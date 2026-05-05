import type { StockAdjustment } from '@/features/inventory/logic/stockAdjustment.types'

/**
 * 20 inventory adjustments with realistic scenarios:
 * - Cycle count: 5 adjustments (quarterly inventory verification)
 * - Damage/Loss: 3 adjustments (defective products, shrinkage)
 * - Transfer: 4 adjustments (inter-warehouse movements)
 * - Manual adjustment: 4 adjustments (supplier errors, corrections)
 * - Reorder stock: 4 adjustments (emergency restocking)
 */
export const mockAdjustments: StockAdjustment[] = Array.from({ length: 20 }, (_, idx) => {
  const n = idx + 1;
  const warehouseNames = ['Kho Quận 1', 'Kho Quận 7', 'Kho Bình Thạnh', 'Kho Tân Bình'];
  const staffMembers = ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Minh C', 'Hoàng Gia D'];
  
  // Determine adjustment type based on index
  let type: 'CYCLE_COUNT' | 'BULK_IMPORT' | 'MANUAL';
  if (n % 5 === 1) type = 'CYCLE_COUNT';
  else if (n % 5 === 2) type = 'BULK_IMPORT';
  else if (n % 5 === 3) type = 'MANUAL';
  else if (n % 5 === 4) type = 'MANUAL';
  else type = 'CYCLE_COUNT';
  
  const reasonsList = {
    'CYCLE_COUNT': ['Kiểm kê hàng quý', 'Kiểm kê tháng', 'Kiểm kê khẩn cấp'],
    'BULK_IMPORT': ['Nhập bổ sung hot items', 'Nhập lại số bị thiếu', 'Nhập từ nhà cung cấp'],
    'MANUAL': ['Sửa lỗi nhập liệu', 'Điều chỉnh thêm', 'Bù trừ lỗi cũ'],
  };
  
  const baseDate = new Date('2026-05-05T00:00:00Z');
  const adjustDate = new Date(baseDate.getTime() - (n % 30) * 24 * 60 * 60 * 1000);
  
  const difference = type === 'CYCLE_COUNT' ? -(n % 5) * 10 : 
                     type === 'BULK_IMPORT' ? (n % 3) * 25 :
                     type === 'MANUAL' ? (n % 2 === 0 ? 5 : -8) : 0;
  
  const systemQty = 100 + (n % 10) * 20;
  const actualQty = systemQty + difference;
  
  const isCompleted = n % 3 !== 0;
  const requiresApproval = type !== 'MANUAL' && type !== 'BULK_IMPORT';
  
  const adjustment: StockAdjustment = {
    id: `adj-${String(n).padStart(3, '0')}`,
    code: `ADJ-2026${String(adjustDate.getUTCMonth() + 1).padStart(2, '0')}${String(adjustDate.getUTCDate()).padStart(2, '0')}-${String(n).padStart(3, '0')}`,
    status: isCompleted ? 'COMPLETED' : (n % 2 === 0 ? 'PENDING_APPROVAL' : 'REJECTED'),
    type,
    requestedBy: staffMembers[n % staffMembers.length],
    requestedAt: adjustDate.toISOString(),
    requiresApproval,
    totalDifference: difference,
    items: [
      {
        id: `item-${n}`,
        stockLevelId: `sl-${String(n).padStart(4, '0')}`,
        sku: `SKU-${String(n % 20 + 1).padStart(3, '0')}`,
        productName: ['Áo thun basic', 'Quần jean slim', 'Váy xòe', 'Giày sneaker', 'Phụ kiện'][n % 5],
        variantName: ['Đen / M', 'Xanh / L', 'Trắng / S', 'Đỏ / XL', 'Xám / M'][n % 5],
        warehouseName: warehouseNames[n % warehouseNames.length],
        systemQty,
        actualQty,
        difference,
        reason: reasonsList[type][n % reasonsList[type].length],
      }
    ],
  };
  
  if (isCompleted && requiresApproval) {
    adjustment.approvedBy = staffMembers[(n + 1) % staffMembers.length];
    adjustment.approvedAt = new Date(adjustDate.getTime() + 2 * 60 * 60 * 1000).toISOString();
  }
  
  return adjustment;
});
