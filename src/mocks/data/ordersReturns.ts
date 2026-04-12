import type { PlatformCode } from '@/types/platform.types'

export type MockOrdersReturnsStatus = 'processing' | 'cancelled' | 'awaiting_pickup' | 'refunded'
export type MockOrdersReturnsKind = 'return' | 'cancel'

export type MockOrdersReturnsItem = {
  id: string
  orderCode: string
  orderKind: MockOrdersReturnsKind
  platform: PlatformCode
  productName: string
  customerName: string
  amount: number
  status: MockOrdersReturnsStatus
  happenedAt: string
}

export const mockOrdersReturns: MockOrdersReturnsItem[] = [
  {
    id: 'ret-001',
    orderCode: 'SPE-001247',
    orderKind: 'return',
    platform: 'shopee',
    productName: 'Áo thun basic trắng L',
    customerName: 'Nguyễn V W A',
    amount: 289000,
    status: 'processing',
    happenedAt: '2026-03-20T10:16:00+07:00',
  },
  {
    id: 'ret-002',
    orderCode: 'TTK-004815',
    orderKind: 'cancel',
    platform: 'tiktok_shop',
    productName: 'Áo khoác bomber đen M',
    customerName: 'Võ Anó E',
    amount: 210000,
    status: 'cancelled',
    happenedAt: '2026-03-20T09:24:00+07:00',
  },
  {
    id: 'ret-003',
    orderCode: 'SPE-001244',
    orderKind: 'return',
    platform: 'shopee',
    productName: 'Giày sneaker trắng 39',
    customerName: 'Pậm Tộj D',
    amount: 1250000,
    status: 'awaiting_pickup',
    happenedAt: '2026-03-19T14:03:00+07:00',
  },
  {
    id: 'ret-004',
    orderCode: 'TTK-004812',
    orderKind: 'return',
    platform: 'tiktok_shop',
    productName: 'Váy hoa nhí size M',
    customerName: 'Trần Tội B',
    amount: 1450000,
    status: 'refunded',
    happenedAt: '2026-03-19T11:55:00+07:00',
  },
  {
    id: 'ret-005',
    orderCode: 'SPE-001238',
    orderKind: 'cancel',
    platform: 'shopee',
    productName: 'Túi tote canvas',
    customerName: 'ĐYng VWh G',
    amount: 220000,
    status: 'cancelled',
    happenedAt: '2026-03-18T15:33:00+07:00',
  },
  {
    id: 'ret-006',
    orderCode: 'SPE-001249',
    orderKind: 'return',
    platform: 'shopee',
    productName: 'Quần jean slim 28',
    customerName: 'Lê Minó C',
    amount: 540000,
    status: 'processing',
    happenedAt: '2026-03-18T10:04:00+07:00',
  },
  {
    id: 'ret-007',
    orderCode: 'LAZ-009231',
    orderKind: 'return',
    platform: 'lazada',
    productName: 'Balo du lịch 20L',
    customerName: 'Hoàng Minh K',
    amount: 680000,
    status: 'processing',
    happenedAt: '2026-03-18T09:08:00+07:00',
  },
  {
    id: 'ret-008',
    orderCode: 'LAZ-009240',
    orderKind: 'cancel',
    platform: 'lazada',
    productName: 'Bình giữ nhiệt 750ml',
    customerName: 'Phạm Yến N',
    amount: 340000,
    status: 'cancelled',
    happenedAt: '2026-03-17T13:18:00+07:00',
  },
  {
    id: 'ret-009',
    orderCode: 'LAZ-009255',
    orderKind: 'return',
    platform: 'lazada',
    productName: 'Sạc dự phòng 20.000mAh',
    customerName: 'Dương Bảo H',
    amount: 890000,
    status: 'awaiting_pickup',
    happenedAt: '2026-03-17T09:47:00+07:00',
  },
]
