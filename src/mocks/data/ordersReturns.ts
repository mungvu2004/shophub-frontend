// Generate returns from real orders
import { mockOrders } from '@/mocks/data/orders'
import type { OrderItem } from '@/types/order.types'

export type MockOrdersReturnsStatus = 'processing' | 'cancelled' | 'awaiting_pickup' | 'refunded'
export type MockOrdersReturnsKind = 'return' | 'cancel'

export type MockOrdersReturnsItem = {
  id: string
  orderCode: string
  orderKind: MockOrdersReturnsKind
  platform: string
  productId: string
  productName: string
  customerName: string
  amount: number
  status: MockOrdersReturnsStatus
  happenedAt: string
  reason?: string
  isAbuseFlagged?: boolean
  evidenceUrls?: string[]
  canAutoRefund?: boolean
}

type OrderItemWithProductId = OrderItem & { productId?: string }

export const mockOrdersReturns: MockOrdersReturnsItem[] = mockOrders
  .filter((_, idx) => idx % 25 === 0)
  .slice(0, 2)
  .flatMap((order, orderIdx) => {
    const statuses: MockOrdersReturnsStatus[] = ['processing', 'awaiting_pickup']
    const reasons = [
      'Sản phẩm lỗi: Khâu lỏng',
      'Đổi ý: Kích thước không vừa',
      'Sản phẩm lỗi: Phai màu',
      'Không đúng với mô tả',
    ]
    const kinds: MockOrdersReturnsKind[] = ['return']
    const evidenceExamples = [
      ['https://placehold.co/600x400/png?text=Evidence+1', 'https://placehold.co/600x400/png?text=Evidence+2'],
    ]

    return order.items
      ?.filter((_, itemIdx) => itemIdx === 0)
      .map((item, itemIdx) => ({
        id: `ret-${String(orderIdx + 1).padStart(3, '0')}`,
        orderCode: order.externalOrderNumber ?? order.id,
        orderKind: kinds[(orderIdx + itemIdx) % kinds.length],
        platform: order.platform,
        productId: (item as OrderItemWithProductId).productId ?? 'unknown',
        productName: item.productName,
        customerName: `${order.buyerFirstName} ${order.buyerLastName}`.trim(),
        amount: Math.round((item.paidPrice || item.itemPrice) * (item.qty || 1)),
        status: statuses[(orderIdx + itemIdx) % statuses.length],
        happenedAt: new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .replace('Z', '+07:00'),
        reason: reasons[(orderIdx + itemIdx) % reasons.length],
        isAbuseFlagged: false,
        evidenceUrls: evidenceExamples[(orderIdx + itemIdx) % evidenceExamples.length],
        canAutoRefund: orderIdx === 0,
      })) ?? []
  })
