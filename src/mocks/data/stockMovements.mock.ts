import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types';

export const mockStockMovementPerformers = [
  { id: 'all', label: 'Tất cả người thực hiện' },
  { id: 'user_01', label: 'Nguyễn Văn A (Kho HN)' },
  { id: 'user_02', label: 'Trần Thị B (Kho HCM)' },
  { id: 'system', label: 'Hệ thống (Auto)' },
];

// Hàm sinh ngày động cho biểu đồ (7 ngày gần nhất) — dùng ngày cố định để tránh phi tất định
const generateDynamicChartData = () => {
  const data = [];
  const baseDate = new Date('2026-05-05T00:00:00Z');
  const inboundPattern = [120, 85, 160, 95, 140, 75, 110];
  const outboundPattern = [90, 110, 70, 130, 80, 120, 95];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setUTCDate(baseDate.getUTCDate() - i);

    const dateLabel = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

    data.push({
      date: dateLabel,
      inbound: inboundPattern[6 - i],
      outbound: outboundPattern[6 - i]
    });
  }
  return data;
};

export const mockChartData = generateDynamicChartData();

export const mockExtendedStockMovements: InventoryStockMovementRecord[] = Array.from({ length: 25 }, (_, idx) => {
  const n = idx + 1;
  const movementTypes = ['IMPORT', 'ORDER_FULFILL', 'MANUAL_ADJUSTMENT', 'MANUAL_ADJUSTMENT', 'DAMAGE_LOSS', 'TRANSFER_OUT'] as const;
  const movementGroups = ['inbound', 'outbound', 'adjustment', 'adjustment', 'adjustment', 'adjustment'] as const;
  const movementTones = ['emerald', 'rose', 'amber', 'amber', 'slate', 'indigo'] as const;
  const warehouseNames = ['Kho Hà Nội', 'Kho HCM', 'Kho Bình Thạnh', 'Kho Tân Bình', 'Kho Quận 7'];
  const platforms = ['shopee', 'lazada', 'tiktok_shop'] as const;
  const skuList = ['SKU-001', 'SKU-003', 'SKU-005', 'SKU-008', 'SKU-010', 'SKU-012', 'SKU-015', 'SKU-018', 'SKU-020', 'SKU-022'];
  const productNames = ['Áo thun basic', 'Quần jean', 'Váy xòe', 'Giày sneaker', 'Phụ kiện'];
  const variantNames = ['Đen / M', 'Xanh / L', 'Trắng / S', 'Đỏ / XL', 'Xám / M'];
  const performers = ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Minh C', 'Hệ thống (Auto)'];
  const reasons = [
    'Nhập hàng định kỳ',
    'Bán hàng Shopee',
    'Kiểm kê hàng quý',
    'Hàng bị lỗi',
    'Chuyển kho',
    'Điều chỉnh thủ công'
  ];
  
  const movementType = movementTypes[n % movementTypes.length];
  const movementGroup = movementGroups[n % movementGroups.length];
  const movementTone = movementTones[n % movementTones.length];
  
  const typeLabels: Record<typeof movementType, string> = {
    'IMPORT': 'Nhập kho',
    'ORDER_FULFILL': 'Xuất kho',
    'MANUAL_ADJUSTMENT': 'Điều chỉnh',
    'DAMAGE_LOSS': 'Hàng lỗi',
    'TRANSFER_OUT': 'Chuyển kho'
  };
  
  const baseDate = new Date('2026-05-05T00:00:00Z');
  const daysAgo = (n * 7) % 30;
  const movementDate = new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  
  const delta = movementGroup === 'inbound' 
    ? 50 + (n % 5) * 30
    : movementGroup === 'outbound' 
    ? -(20 + (n % 8) * 15)
    : n % 2 === 0 ? -(n % 3) * 5 : (n % 2) * 8;
  
  const qtyBefore = 150 + (n % 10) * 25;
  const qtyAfter = qtyBefore + delta;
  
  const timeLabelsMap = [
    'Hôm nay', 'Hôm qua', '2 ngày trước', '3 ngày trước', '4 ngày trước',
    '1 tuần trước', '2 tuần trước', '3 tuần trước'
  ];
  const timeLabel = timeLabelsMap[daysAgo % timeLabelsMap.length];
  
  const isAnomaly = delta < -100 || (movementType === 'DAMAGE_LOSS' && Math.abs(delta) > 30);
  
  return {
    id: 1000 + n,
    movementType,
    movementGroup,
    movementTypeLabel: typeLabels[movementType],
    movementTone,
    platform: platforms[n % platforms.length],
    platformLabel: platforms[n % platforms.length].toUpperCase(),
    warehouseId: n % 2 === 0 ? 'wh-001' : 'wh-002',
    warehouseName: warehouseNames[n % warehouseNames.length],
    sku: skuList[n % skuList.length],
    productName: productNames[n % productNames.length],
    variantName: variantNames[n % variantNames.length],
    delta,
    deltaLabel: delta > 0 ? `+${delta}` : `${delta}`,
    qtyBefore,
    qtyAfter,
    reason: reasons[n % reasons.length],
    note: `Lô hàng ${n} - Ghi chú chi tiết về sự kiện kho`,
    attachments: n % 3 === 0 ? ['https://example.com/receipt.pdf', 'https://example.com/photo.jpg'] : [],
    performerName: performers[n % performers.length],
    createdAt: movementDate.toISOString(),
    createdAtLabel: timeLabel,
    createdByLabel: performers[n % performers.length],
    ...(isAnomaly && { isAnomaly }),
  };
});
