import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types';

export const mockStockMovementPerformers = [
  { id: 'all', label: 'Tất cả người thực hiện' },
  { id: 'user_01', label: 'Nguyễn Văn A (Kho HN)' },
  { id: 'user_02', label: 'Trần Thị B (Kho HCM)' },
  { id: 'system', label: 'Hệ thống (Auto)' },
];

// Hàm sinh ngày động cho biểu đồ (7 ngày gần nhất)
const generateDynamicChartData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const dateLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    // Sinh số lượng ngẫu nhiên để trông thật hơn
    data.push({
      date: dateLabel,
      inbound: Math.floor(Math.random() * 150) + 50,
      outbound: Math.floor(Math.random() * 150) + 40
    });
  }
  return data;
};

export const mockChartData = generateDynamicChartData();

export const mockExtendedStockMovements: InventoryStockMovementRecord[] = [
  {
    id: 1001,
    movementType: 'IMPORT',
    movementGroup: 'inbound',
    movementTypeLabel: 'Nhập kho',
    movementTone: 'emerald',
    platform: 'shopee',
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
    createdAt: new Date().toISOString(),
    createdAtLabel: 'Hôm nay',
    createdByLabel: 'Nguyễn Văn A',
  },
  {
    id: 1002,
    movementType: 'MANUAL_ADJUSTMENT',
    movementGroup: 'adjustment',
    movementTypeLabel: 'Điều chỉnh',
    movementTone: 'amber',
    platform: 'shopee',
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
    isAnomaly: true,
    attachments: ['https://example.com/audit_report.pdf'],
    performerName: 'Trần Thị B',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdAtLabel: 'Hôm qua',
    createdByLabel: 'Trần Thị B',
  },
];
