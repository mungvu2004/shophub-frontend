import type {
  CRMCustomerProfileDetail,
  CRMCustomerProfileListItem,
  CRMCustomerProfilesResponse,
  CRMCustomerProfilesSummary,
  CRMReviewPlatform,
} from '@/types/crm.types'

export type CRMCustomerProfileOrderFilter = 'all' | 'shopee' | 'tiktok' | 'returns'

export const crmCustomerProfileOrderFilters: Array<{
  id: CRMCustomerProfileOrderFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'shopee', label: 'Shopee' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'returns', label: 'Hoàn/Huỷ' },
]

const moneyFormatter = new Intl.NumberFormat('vi-VN')

const segmentClasses = {
  vip_gold: 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]',
  regular_blue: 'bg-[#eef2ff] text-[#4f46e5] border-[#c7d2fe]',
  at_risk_red: 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]',
} as const

const platformClasses: Record<CRMReviewPlatform, string> = {
  shopee: 'bg-[#fff7ed] text-[#c2410c]',
  tiktok: 'bg-[#0f172a] text-white',
  lazada: 'bg-[#dbeafe] text-[#2563eb]',
}

function formatCurrency(value: number) {
  return `${moneyFormatter.format(value)} ₫`
}

function formatCompactCurrency(value: number) {
  return moneyFormatter.format(value)
}

function getPlatformLabel(platform: CRMReviewPlatform) {
  if (platform === 'lazada') return 'Lazada'
  if (platform === 'tiktok') return 'TikTok'
  return 'Shopee'
}

function getPlatformBadge(platform: CRMReviewPlatform) {
  return {
    id: platform,
    label: getPlatformLabel(platform),
    className: platformClasses[platform],
  }
}

function getSegmentBadge(label: string, tone: keyof typeof segmentClasses) {
  return {
    label,
    className: segmentClasses[tone],
  }
}

function getFilterLabel(filter: CRMCustomerProfileOrderFilter) {
  return crmCustomerProfileOrderFilters.find((item) => item.id === filter)?.label ?? 'Tất cả'
}

function buildSummary(summary: CRMCustomerProfilesSummary) {
  return [
    {
      label: 'Tổng khách hàng',
      value: String(summary.totalCustomers),
      subtext: `${summary.activePlatforms} kênh đang hoạt động`,
    },
    {
      label: 'Tổng đơn',
      value: String(summary.totalOrders),
      subtext: 'Từ tất cả khách hàng đang lọc',
    },
    {
      label: 'Tổng chi tiêu',
      value: formatCurrency(summary.totalSpend),
      subtext: `AOV: ${formatCurrency(summary.averageOrderValue)}`,
    },
  ]
}

function buildCustomerListItem(item: CRMCustomerProfileListItem) {
  return {
    id: item.id,
    avatarUrl: item.avatarUrl,
    fullName: item.fullName,
    maskedPhone: item.maskedPhone,
    customerCode: item.customerCode,
    platformBadges: item.platformCodes.map(getPlatformBadge),
    totalOrdersLabel: String(item.totalOrders),
    totalSpendLabel: formatCurrency(item.totalSpend),
    lastOrderLabel: item.lastOrderLabel,
    segmentBadge: getSegmentBadge(item.segment.label, item.segment.tone),
    detailLabel: 'Chi tiết',
  }
}

function buildDetailCustomer(customer: CRMCustomerProfileDetail, orderFilter: CRMCustomerProfileOrderFilter) {
  const filteredOrders = customer.orders.filter((order) => {
    if (orderFilter === 'all') return true
    if (orderFilter === 'returns') return order.statusKey === 'returned'
    return order.platform === orderFilter
  })

  return {
    id: customer.id,
    avatarUrl: customer.avatarUrl,
    fullName: customer.fullName,
    maskedPhone: customer.maskedPhone,
    email: customer.email,
    customerSinceLabel: customer.customerSinceLabel,
    segmentBadge: getSegmentBadge(customer.segment.label, customer.segment.tone),
    platformBadges: customer.platformLabels.map((item) => ({
      id: item.id,
      label: item.label,
      className: platformClasses[item.id],
    })),
    primaryCtaLabel: customer.primaryCtaLabel,
    secondaryCtaLabel: customer.secondaryCtaLabel,
    stats: [
      {
        label: 'TỔNG ĐƠN HÀNG',
        value: String(customer.stats.totalOrders),
        subtext: '+12% so với T12',
      },
      {
        label: 'TỔNG CHI TIÊU',
        value: formatCurrency(customer.stats.totalSpend),
        subtext: `AOV: ${formatCurrency(customer.stats.averageOrderValue)}`,
      },
      {
        label: 'ĐƠN GẦN NHẤT',
        value: customer.stats.lastOrderLabel,
        subtext: customer.customerSinceLabel,
      },
    ],
    lifecycle: customer.lifecycle,
    orderFilterOptions: crmCustomerProfileOrderFilters,
    selectedFilterLabel: getFilterLabel(orderFilter),
    orders: filteredOrders.map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      dateLabel: order.dateLabel,
      productName: order.productName,
      amountLabel: formatCompactCurrency(order.amount),
      statusLabel: order.statusLabel,
      statusTone: order.statusTone,
      platformLabel: getPlatformLabel(order.platform),
      platformClassName: platformClasses[order.platform],
    })),
    emptyOrdersLabel: 'Chưa có đơn nào phù hợp bộ lọc này.',
    insight: customer.insight,
    rfm: customer.rfm,
    notes: customer.notes,
    reviews: customer.reviews,
  }
}

export function buildCRMCustomerProfilesViewModel(
  response: CRMCustomerProfilesResponse,
  orderFilter: CRMCustomerProfileOrderFilter,
) {
  return {
    summary: buildSummary(response.summary),
    customers: response.customers.map(buildCustomerListItem),
    selectedCustomer: response.selectedCustomer ? buildDetailCustomer(response.selectedCustomer, orderFilter) : null,
  }
}

export type CRMCustomerProfilesViewModel = ReturnType<typeof buildCRMCustomerProfilesViewModel>
