import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types';

export const mockStockMovementPerformers = [
  { id: 'all', label: 'Tất cả người thực hiện' },
  { id: 'user_01', label: 'Nguyễn Văn A (Kho HN)' },
  { id: 'user_02', label: 'Trần Thị B (Kho HCM)' },
  { id: 'system', label: 'Hệ thống (Auto)' },
];

export const mockExtendedStockMovements: InventoryStockMovementRecord[] = [
  {
    id: 1001,
    movementType: 'IMPORT',
    movementGroup: 'inbound',
    movementTypeLabel: 'Nhập kho',
    movementTone: 'emerald',
    platform: 'Da san',
    platformLabel: 'Đa sàn',
    warehouseId: 'WH_HN_01',
    warehouseName: 'Kho Hà Nội',
    sku: 'TSHIRT-BLUE-L',
    productName: 'Áo thun Nam',
    variantName: 'Xanh dương, L',
    delta: 100,
    deltaLabel: '+100',
    qtyBefore: 50,
    qtyAfter: 150,
    reason: 'Nhập hàng định kỳ',
    note: 'Lô hàng từ nhà cung cấp X',
    attachments: ['https://example.com/receipt1.pdf', 'https://example.com/photo1.jpg'],
    performerName: 'Nguyễn Văn A',
    createdAt: '2024-03-20T10:00:00Z',
    createdAtLabel: '20/03/2024 10:00',
    createdByLabel: 'Nguyễn Văn A',
  },
  {
    id: 1002,
    movementType: 'MANUAL_ADJUSTMENT',
    movementGroup: 'adjustment',
    movementTypeLabel: 'Điều chỉnh',
    movementTone: 'amber',
    platform: 'Shopee',
    platformLabel: 'Shopee',
    warehouseId: 'WH_HCM_01',
    warehouseName: 'Kho HCM',
    sku: 'JEAN-BLACK-M',
    productName: 'Quần Jean Nam',
    variantName: 'Đen, M',
    delta: -500,
    deltaLabel: '-500',
    qtyBefore: 600,
    qtyAfter: 100,
    reason: 'Kiểm kê kho',
    note: 'Phát hiện sai lệch lớn sau kiểm kê tháng 3',
    isAnomaly: true, // Mark as anomaly due to large adjustment
    attachments: ['https://example.com/audit_report.pdf'],
    performerName: 'Trần Thị B',
    createdAt: '2024-03-19T14:30:00Z',
    createdAtLabel: '19/03/2024 14:30',
    createdByLabel: 'Trần Thị B',
  },
  // Add more mock entries as needed for chart and list
];

export const mockChartData = [
  { date: '15/03', inbound: 120, outbound: 80 },
  { date: '16/03', inbound: 45, outbound: 60 },
  { date: '17/03', inbound: 200, outbound: 150 },
  { date: '18/03', inbound: 30, outbound: 90 },
  { date: '19/03', inbound: 100, outbound: 110 },
  { date: '20/03', inbound: 150, outbound: 70 },
];
