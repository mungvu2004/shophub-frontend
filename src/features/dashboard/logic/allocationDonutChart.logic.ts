import type {
  AllocationDonutChartModelParams,
  AllocationDonutChartViewModel,
  AllocationStatusKey,
} from '@/features/dashboard/logic/allocationDonutChart.types'

const STATUS_COLORS: Record<AllocationStatusKey, string> = {
  shipping: '#3525CD',
  pendingConfirm: '#F97316',
  delivered: '#10B981',
  returnedOrCancelled: '#CBD5E1',
}

const STATUS_LABELS: Record<AllocationStatusKey, string> = {
  shipping: 'Đang giao',
  pendingConfirm: 'Chờ xác nhận',
  delivered: 'Đã giao',
  returnedOrCancelled: 'Hoàn/Hủy',
}

const SHIPPING_STATUSES = new Set(['shipped', 'readytoship', 'packed'])
const PENDING_CONFIRM_STATUSES = new Set(['pending', 'pendingpayment', 'confirmed'])
const DELIVERED_STATUSES = new Set(['delivered'])
const RETURNED_OR_CANCELLED_STATUSES = new Set(['cancelled', 'returned', 'refunded', 'faileddelivery', 'lost'])

const getNormalizedStatus = (status: unknown) => (typeof status === 'string' ? status.toLowerCase() : '')

function resolveBucket(status: unknown): AllocationStatusKey {
  const normalizedStatus = getNormalizedStatus(status)

  if (SHIPPING_STATUSES.has(normalizedStatus)) return 'shipping'
  if (PENDING_CONFIRM_STATUSES.has(normalizedStatus)) return 'pendingConfirm'
  if (DELIVERED_STATUSES.has(normalizedStatus)) return 'delivered'
  if (RETURNED_OR_CANCELLED_STATUSES.has(normalizedStatus)) return 'returnedOrCancelled'

  return 'pendingConfirm'
}

export function buildAllocationDonutChartViewModel({ orders = [] }: AllocationDonutChartModelParams): AllocationDonutChartViewModel {
  const counters: Record<AllocationStatusKey, number> = {
    shipping: 0,
    pendingConfirm: 0,
    delivered: 0,
    returnedOrCancelled: 0,
  }

  for (const order of orders) {
    const bucket = resolveBucket(order.status)
    counters[bucket] += 1
  }

  const slices = (Object.keys(counters) as AllocationStatusKey[]).map((key) => ({
    key,
    label: STATUS_LABELS[key],
    value: counters[key],
    color: STATUS_COLORS[key],
  }))

  const totalOrders = slices.reduce((sum, slice) => sum + slice.value, 0)

  return {
    title: 'Phân bổ đơn hàng',
    totalOrders,
    unitLabel: 'ĐƠN HÀNG',
    slices,
    hasData: totalOrders > 0,
  }
}
