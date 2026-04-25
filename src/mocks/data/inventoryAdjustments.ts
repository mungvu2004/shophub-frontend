import type { StockAdjustment } from '@/features/inventory/logic/stockAdjustment.types'

export const mockAdjustments: StockAdjustment[] = [
  {
    id: 'adj-001',
    code: 'ADJ-20240425-001',
    status: 'PENDING_APPROVAL',
    type: 'CYCLE_COUNT',
    requestedBy: 'Nguyễn Văn A',
    requestedAt: '2024-04-25T08:30:00Z',
    requiresApproval: true,
    totalDifference: -52,
    items: [
      {
        id: 'item-1',
        stockLevelId: 'sl-1',
        sku: 'TSHIRT-BLUE-L',
        productName: 'Áo thun Nam Basic',
        variantName: 'Xanh dương / L',
        warehouseName: 'Kho Quận 1',
        systemQty: 100,
        actualQty: 48,
        difference: -52,
        reason: 'Hao hụt kiểm kê',
      }
    ]
  },
  {
    id: 'adj-002',
    code: 'ADJ-20240424-002',
    status: 'COMPLETED',
    type: 'MANUAL',
    requestedBy: 'Trần Thị B',
    requestedAt: '2024-04-24T14:20:00Z',
    requiresApproval: false,
    totalDifference: 5,
    items: [
      {
        id: 'item-2',
        stockLevelId: 'sl-2',
        sku: 'JEAN-SLIM-32',
        productName: 'Quần Jean Slimfit',
        variantName: 'Xanh Indigo / 32',
        warehouseName: 'Kho Quận 7',
        systemQty: 20,
        actualQty: 25,
        difference: 5,
        reason: 'Nhập dư từ nhà cung cấp',
      }
    ],
    approvedBy: 'Admin',
    approvedAt: '2024-04-24T15:00:00Z'
  }
]
