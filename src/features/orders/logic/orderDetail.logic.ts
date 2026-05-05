import type { Order } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

import type {
  NullableOrderStatus,
  OrderDetailHistoryItem,
  OrderDetailLocationState,
  OrderDetailReviewItem,
  OrderDetailResponse,
  OrderDetailViewData,
  OrderDetailViewModel,
  OrderStatusInfo,
} from '@/features/orders/logic/orderDetail.types'

const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function formatDateTime(value?: string): string {
  if (!value) return '--/-- --:--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--/-- --:--'

  return DATE_TIME_FORMATTER.format(date)
}

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(Math.max(0, Math.round(value))).replace('₫', 'đ')
}

function platformLabel(platform: PlatformCode): string {
  if (platform === 'shopee') return 'Shopee'
  if (platform === 'lazada') return 'Lazada'
  return 'TikTok Shop'
}

function toPlatformCode(value: string | undefined): PlatformCode {
  if (!value) return 'shopee'
  const lower = value.toLowerCase()
  if (lower.includes('lazada')) return 'lazada'
  if (lower.includes('tiktok')) return 'tiktok_shop'
  return 'shopee'
}

function normalizeFallbackStatus(value: string | undefined): NullableOrderStatus | undefined {
  if (!value) return undefined

  const normalized = value.trim().toLowerCase()

  if (normalized.includes('chờ xác nhận') || normalized.includes('cho xac nhan')) return 'Pending'
  if (normalized.includes('đang giao') || normalized.includes('dang giao')) return 'Shipped'
  if (normalized.includes('đã giao') || normalized.includes('da giao')) return 'Delivered'
  if (normalized.includes('đã huỷ') || normalized.includes('da huy') || normalized.includes('đã hủy') || normalized.includes('da huy')) return 'Cancelled'

  return value
}

function resolveStatusInfo(status: NullableOrderStatus): OrderStatusInfo {
  if (status === 'Cancelled' || status === 'FailedDelivery' || status === 'Returned' || status === 'Refunded' || status === 'Lost') {
    return {
      label: 'Đơn có vấn đề',
      message: 'Đơn này đang ở trạng thái hoàn/hủy hoặc thất bại.',
      tone: 'danger',
    }
  }

  if (status === 'Delivered') {
    return {
      label: 'Đã giao thành công',
      message: 'Đơn đã hoàn tất giao cho khách hàng.',
      tone: 'success',
    }
  }

  if (status === 'Shipped') {
    return {
      label: 'Đang giao hàng',
      message: 'Đơn đang trong quá trình vận chuyển.',
      tone: 'processing',
    }
  }

  if (status === 'Pending' || status === 'PendingPayment') {
    return {
      label: 'Chờ xác nhận',
      message: 'Đơn đang chờ người bán xác nhận.',
      tone: 'processing',
    }
  }

  if (status === 'Confirmed' || status === 'Packed' || status === 'ReadyToShip') {
    return {
      label: 'Đang xác nhận',
      message: 'Đơn đang chờ bước lấy hàng hoặc giao cho đơn vị vận chuyển.',
      tone: 'processing',
    }
  }

  return {
    label: typeof status === 'string' ? status : 'Đang xử lý',
    message: 'Đơn đang được xử lý.',
    tone: 'neutral',
  }
}

function buildQuickActions(status: NullableOrderStatus, suggestedAction?: string): Array<{ id: string; label: string; tone: 'primary' | 'danger' | 'neutral' }> {
  const actions: Array<{ id: string; label: string; tone: 'primary' | 'danger' | 'neutral' }> = []

  if (status === 'Pending' || status === 'PendingPayment' || status === 'Confirmed' || status === 'Packed' || status === 'ReadyToShip') {
    actions.push(
      { id: 'confirm-order', label: 'Xác nhận đơn', tone: 'primary' },
      { id: 'cancel-order', label: 'Hủy đơn', tone: 'danger' },
    )
  } else if (status === 'Shipped') {
    actions.push(
      { id: 'track-order', label: 'Theo dõi vận chuyển', tone: 'primary' },
      { id: 'cancel-order', label: 'Yêu cầu hủy', tone: 'danger' },
    )
  } else if (status === 'Delivered') {
    actions.push(
      { id: 'view-proof', label: 'Xem bằng chứng giao', tone: 'neutral' },
      { id: 'refund-order', label: 'Tạo yêu cầu hoàn', tone: 'danger' },
    )
  } else {
    actions.push({ id: 'view-support', label: 'Xem chi tiết xử lý', tone: 'neutral' })
  }

  if (suggestedAction && suggestedAction.trim().length > 0) {
    actions.unshift({
      id: 'suggested-action',
      label: suggestedAction,
      tone: 'neutral',
    })
  }

  return actions
}

function buildHistory(order: Order | null, fallbackStatus: string | undefined): OrderDetailHistoryItem[] {
  const status = order?.status ?? fallbackStatus ?? 'Pending'
  const statusInfo = resolveStatusInfo(status)

  const created = formatDateTime(order?.createdAt_platform ?? order?.createdAt)
  const updated = formatDateTime(order?.updatedAt_platform ?? order?.updatedAt)

  const isConfirmedDone = status !== 'Pending' && status !== 'PendingPayment'
  const isPickupDone = status === 'Shipped' || status === 'Delivered'
  const isDeliveryDone = status === 'Delivered'

  return [
    {
      id: 'created',
      title: 'Đặt hàng',
      happenedAtLabel: created,
      done: true,
    },
    {
      id: 'confirmed',
      title: 'Xác nhận',
      happenedAtLabel: updated,
      done: isConfirmedDone,
      active: !isConfirmedDone,
    },
    {
      id: 'pickup',
      title: 'Lấy hàng',
      happenedAtLabel: statusInfo.label,
      done: isPickupDone,
      active: !isPickupDone && isConfirmedDone,
    },
    {
      id: 'delivery',
      title: 'Giao hàng',
      happenedAtLabel: isDeliveryDone ? 'Hoàn tất' : 'Chờ',
      done: isDeliveryDone,
      active: !isDeliveryDone && isPickupDone,
    },
  ]
}

type ProductGetter = (productId: string) => { name?: string } | null | undefined

function buildReviews(order: Order | null, fallbackState: OrderDetailLocationState | null | undefined, getProduct?: ProductGetter): OrderDetailReviewItem[] {
  let productName = fallbackState?.productName ?? 'Sản phẩm'
  
  // Use centralized product data if available
  if (getProduct && order?.items?.[0]?.productId) {
    const product = getProduct(order.items[0].productId)
    if (product?.name) {
      productName = product.name
    }
  } else {
    productName = fallbackState?.productName ?? order?.items?.[0]?.productName ?? 'Sản phẩm'
  }

  if (order?.status === 'Delivered') {
    return [
      {
        id: 'review-1',
        sourceLabel: platformLabel(order.platform),
        rating: 5,
        content: `${productName} đúng mô tả, giao nhanh.`,
        createdAtLabel: formatDateTime(order.updatedAt ?? order.updatedAt_platform),
        sentiment: 'positive',
      },
    ]
  }

  return [
    {
      id: 'review-pending',
      sourceLabel: fallbackState?.platformLabel ?? (order ? platformLabel(order.platform) : 'Shopee'),
      rating: 0,
      content: 'Chưa có đánh giá từ khách hàng cho đơn này.',
      createdAtLabel: '--',
      sentiment: 'neutral',
    },
  ]
}

function maskPhone(value?: string): string {
  if (!value) return '0901•••••89'
  if (value.length <= 6) return value
  return `${value.slice(0, 4)}••••${value.slice(-2)}`
}

function parseAmountLabel(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const number = Number(value.replace(/[^\d]/g, ''))
  return Number.isFinite(number) && number > 0 ? number : fallback
}

export function buildOrderDetailResponse(input: {
  id: string
  order: Order | null
  fallbackState?: OrderDetailLocationState | null
  getProduct?: ProductGetter
}): OrderDetailResponse {
  const { id, order, fallbackState, getProduct } = input

  const fallbackPlatform = toPlatformCode(fallbackState?.platformLabel)
  const platform = order?.platform ?? fallbackPlatform
  const resolvedStatus = order?.status ?? normalizeFallbackStatus(fallbackState?.statusLabel) ?? 'Pending'
  const amount = order?.totalAmount ?? parseAmountLabel(fallbackState?.amountLabel, 390000)
  const subtotal = Math.round(amount * 0.97)
  const shipping = Math.max(0, amount - subtotal)
  const voucher = order?.items?.[0]?.voucherAmount ?? Math.round(amount * 0.05)

  const view: OrderDetailViewData = {
    orderId: order?.id ?? id,
    orderCode: order?.externalOrderNumber ?? fallbackState?.orderCode ?? id.toUpperCase(),
    suggestedActionLabel: fallbackState?.actionLabel,
    platform,
    platformLabel: fallbackState?.platformLabel ?? platformLabel(platform),
    customerName:
      `${order?.buyerFirstName ?? ''} ${order?.buyerLastName ?? ''}`.trim()
      || fallbackState?.customerName
      || 'Khách hàng',
    phone: maskPhone(order?.buyerPhone),
    address: order?.shippingAddress ?? 'Chưa có địa chỉ',
    productName: fallbackState?.productName ?? order?.items?.[0]?.productName ?? 'Sản phẩm chưa đồng bộ',
    quantity: order?.items?.[0]?.qty ?? 1,
    statusLabel: resolvedStatus,
    createdAtLabel: formatDateTime(order?.createdAt ?? order?.createdAt_platform),
    updatedAtLabel: formatDateTime(order?.updatedAt ?? order?.updatedAt_platform),
    subtotalLabel: formatCurrency(subtotal),
    shippingLabel: formatCurrency(shipping),
    voucherLabel: `-${formatCurrency(voucher)}`,
    totalLabel: formatCurrency(amount),
    history: buildHistory(order, resolvedStatus),
    reviews: buildReviews(order, fallbackState, getProduct),
  }

  return {
    order: order ?? undefined,
    view,
  }
}

export function buildOrderDetailViewModel(response: OrderDetailResponse): OrderDetailViewModel {
  const statusInfo = resolveStatusInfo(response.view.statusLabel)

  const platformClassName =
    response.view.platform === 'shopee'
      ? 'bg-[#EE4D2D] text-white'
      : response.view.platform === 'lazada'
        ? 'bg-[#4338ca] text-white'
        : 'bg-slate-900 text-white'

  return {
    title: 'Chi tiết đơn hàng',
    orderCode: response.view.orderCode,
    platformLabel: response.view.platformLabel,
    platformClassName,
    statusMessage: `${statusInfo.label} - ${response.view.updatedAtLabel}`,
    statusTone: statusInfo.tone,
    quickActions: buildQuickActions(response.view.statusLabel, response.view.suggestedActionLabel),
    tabs: [
      { id: 'detail', label: 'Chi tiết' },
      { id: 'history', label: 'Lịch sử' },
      { id: 'review', label: 'Review KH' },
    ],
    view: response.view,
  }
}
