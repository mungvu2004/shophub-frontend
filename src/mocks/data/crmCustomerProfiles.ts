import type {
  CRMCustomerProfileDetail,
  CRMCustomerProfileListItem,
  CRMCustomerProfilesResponse,
  CRMCustomerProfilesSummary,
} from '@/types/crm.types'

const customerProfiles: CRMCustomerProfileDetail[] = [
  {
    id: 'cust-001',
    customerCode: 'KH-001',
    fullName: 'Nguyễn Thị Lan',
    maskedPhone: '0912***456',
    email: 'lan.nguyen***@gmail.com',
    avatarUrl: 'https://www.figma.com/api/mcp/asset/70fec9eb-0fa3-4aca-bd53-fa6a6d45017f',
    customerSinceLabel: '01/06/2023',
    segment: { id: 'vip_gold', label: 'VIP Gold', tone: 'vip_gold' },
    platformLabels: [
      { id: 'shopee', label: 'Shopee', tone: 'shopee' },
      { id: 'tiktok', label: 'TikTok', tone: 'tiktok' },
    ],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 47,
      totalSpend: 18750000,
      lastOrderLabel: '3 ngày trước',
      averageOrderValue: 398000,
    },
    lifecycle: [
      { dateLabel: '01/06/2023', title: 'Đơn đầu tiên' },
      { dateLabel: 'T8/2023', title: 'Khách thân thiết' },
      { dateLabel: 'T1/2024', title: 'Khách VIP' },
      { dateLabel: 'Hôm nay', title: 'Hiện tại', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-001',
        orderCode: '#SP99281',
        dateLabel: '21/01/2024',
        productName: 'Áo thun Oversize (x2)',
        platform: 'shopee',
        amount: 450000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
      {
        id: 'order-002',
        orderCode: '#TT77123',
        dateLabel: '15/01/2024',
        productName: 'Quần Jeans Slimfit',
        platform: 'tiktok',
        amount: 590000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
      {
        id: 'order-003',
        orderCode: '#SP98101',
        dateLabel: '02/01/2024',
        productName: 'Váy hoa nhí Vintage',
        platform: 'shopee',
        amount: 320000,
        statusLabel: 'Đã hoàn hàng',
        statusKey: 'returned',
        statusTone: 'neutral',
      },
    ],
    notes: [
      {
        id: 'note-001',
        content: 'Khách hay hỏi về size form rộng, ưu tiên tư vấn size. Lần sau nên tặng mã freeship.',
        createdAtLabel: 'bởi SUPPORT - 15/01/2024',
        authorLabel: 'SUPPORT',
      },
      {
        id: 'note-002',
        content: 'Đã nhắn tin mời khách trải nghiệm bộ sưu tập mới, phản hồi khá tích cực.',
        createdAtLabel: 'bởi CRM - 08/02/2024',
        authorLabel: 'CRM',
      },
    ],
    reviews: [
      {
        id: 'review-001',
        sourceLabel: 'Shopee',
        rating: 5,
        content: 'Vải đẹp, mặc lên chuẩn form. Shop tư vấn nhanh và nhiệt tình.',
        productName: 'Áo thun Oversize',
        sentimentLabel: 'Positive',
      },
      {
        id: 'review-002',
        sourceLabel: 'TikTok',
        rating: 4,
        content: 'Giao hàng hơi lâu nhưng bù lại chất lượng ổn, sẽ quay lại.',
        productName: 'Quần Jeans Slimfit',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '8/10', progressPercent: 82 },
      { label: 'FREQUENCY', value: '9/10', progressPercent: 90 },
      { label: 'MONETARY', value: '7/10', progressPercent: 72 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 84%',
      description:
        'Khách hàng trung thành, tần suất mua cao (2.1 đơn/tháng), ưa thích khuyến mãi vận chuyển.',
      favoriteProductLabel: 'Áo (65%)',
      favoriteChannelLabel: 'TikTok (72%)',
      churnRiskLabel: 'Low (8%)',
      churnRiskPercent: 8,
    },
  },
  {
    id: 'cust-002',
    customerCode: 'KH-002',
    fullName: 'Trần Văn Hùng',
    maskedPhone: '0983***112',
    email: 'hung.tran***@gmail.com',
    avatarUrl: 'https://www.figma.com/api/mcp/asset/3b45d231-63ea-4b14-a3a2-a387dd298634',
    customerSinceLabel: '12/09/2023',
    segment: { id: 'regular_blue', label: 'Regular Blue', tone: 'regular_blue' },
    platformLabels: [{ id: 'lazada', label: 'Lazada', tone: 'lazada' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 12,
      totalSpend: 4200000,
      lastOrderLabel: '12 ngày trước',
      averageOrderValue: 350000,
    },
    lifecycle: [
      { dateLabel: '09/2023', title: 'Lazada lần đầu' },
      { dateLabel: '12/2023', title: 'Mua lặp lại' },
      { dateLabel: '01/2024', title: 'Ổn định' },
      { dateLabel: 'Hôm nay', title: 'Theo dõi', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-101',
        orderCode: '#LZ88214',
        dateLabel: '18/01/2024',
        productName: 'Áo sơ mi Oversize',
        platform: 'lazada',
        amount: 390000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
      {
        id: 'order-102',
        orderCode: '#LZ88110',
        dateLabel: '05/01/2024',
        productName: 'Quần jean slim',
        platform: 'lazada',
        amount: 610000,
        statusLabel: 'Đã hoàn hàng',
        statusKey: 'returned',
        statusTone: 'neutral',
      },
    ],
    notes: [
      {
        id: 'note-101',
        content: 'Ưu tiên gửi thông tin tracking và khuyến mãi freeship qua Lazada.',
        createdAtLabel: 'bởi SALES - 20/01/2024',
        authorLabel: 'SALES',
      },
    ],
    reviews: [
      {
        id: 'review-101',
        sourceLabel: 'Lazada',
        rating: 4,
        content: 'Sản phẩm ổn, đóng gói kỹ, cần phản hồi nhanh hơn ở chat.',
        productName: 'Áo sơ mi Oversize',
        sentimentLabel: 'Neutral',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '6/10', progressPercent: 60 },
      { label: 'FREQUENCY', value: '6/10', progressPercent: 62 },
      { label: 'MONETARY', value: '5/10', progressPercent: 54 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 79%',
      description: 'Khách có xu hướng mua theo đợt khuyến mãi và phản hồi tốt với voucher vận chuyển.',
      favoriteProductLabel: 'Áo sơ mi (58%)',
      favoriteChannelLabel: 'Lazada (81%)',
      churnRiskLabel: 'Medium (24%)',
      churnRiskPercent: 24,
    },
  },
  {
    id: 'cust-003',
    customerCode: 'KH-003',
    fullName: 'Lê Minh Tuấn',
    maskedPhone: '0345***889',
    email: 'tuan.le***@gmail.com',
    avatarUrl: 'https://www.figma.com/api/mcp/asset/50176b6b-31a0-49da-94c7-d4723e938e24',
    customerSinceLabel: '04/02/2024',
    segment: { id: 'at_risk_red', label: 'At Risk Red', tone: 'at_risk_red' },
    platformLabels: [{ id: 'lazada', label: 'Lazada', tone: 'lazada' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 2,
      totalSpend: 850000,
      lastOrderLabel: '45 ngày trước',
      averageOrderValue: 425000,
    },
    lifecycle: [
      { dateLabel: '02/2024', title: 'Mua lần đầu' },
      { dateLabel: '03/2024', title: 'Mua lại chậm' },
      { dateLabel: 'Hôm nay', title: 'Cần kích hoạt', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-201',
        orderCode: '#LZ99102',
        dateLabel: '13/03/2024',
        productName: 'Áo khoác gió',
        platform: 'lazada',
        amount: 850000,
        statusLabel: 'Đã hoàn hàng',
        statusKey: 'returned',
        statusTone: 'neutral',
      },
    ],
    notes: [
      {
        id: 'note-201',
        content: 'Nên gọi điện chăm sóc trước đợt sale, khách nhạy cảm với phí ship.',
        createdAtLabel: 'bởi SUPPORT - 10/04/2024',
        authorLabel: 'SUPPORT',
      },
    ],
    reviews: [
      {
        id: 'review-201',
        sourceLabel: 'Lazada',
        rating: 2,
        content: 'Áo đẹp nhưng giao hàng hơi lâu, shop phản hồi chat chậm.',
        productName: 'Áo khoác gió',
        sentimentLabel: 'Negative',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '4/10', progressPercent: 40 },
      { label: 'FREQUENCY', value: '3/10', progressPercent: 30 },
      { label: 'MONETARY', value: '4/10', progressPercent: 42 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 76%',
      description: 'Khách có nguy cơ rời bỏ nếu không có ưu đãi vận chuyển hoặc nhắc mua lại.',
      favoriteProductLabel: 'Áo khoác (71%)',
      favoriteChannelLabel: 'Lazada (78%)',
      churnRiskLabel: 'High (48%)',
      churnRiskPercent: 48,
    },
  },
]

function buildListItem(detail: CRMCustomerProfileDetail): CRMCustomerProfileListItem {
  return {
    id: detail.id,
    customerCode: detail.customerCode,
    fullName: detail.fullName,
    maskedPhone: detail.maskedPhone,
    avatarUrl: detail.avatarUrl,
    platformCodes: detail.platformLabels.map((item) => item.id),
    totalOrders: detail.stats.totalOrders,
    totalSpend: detail.stats.totalSpend,
    lastOrderLabel: detail.stats.lastOrderLabel,
    segment: detail.segment,
  }
}

export function buildCRMCustomerProfilesSummary(items: CRMCustomerProfileDetail[]): CRMCustomerProfilesSummary {
  const totalCustomers = items.length
  const totalOrders = items.reduce((accumulator, item) => accumulator + item.stats.totalOrders, 0)
  const totalSpend = items.reduce((accumulator, item) => accumulator + item.stats.totalSpend, 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0
  const activePlatforms = new Set(items.flatMap((item) => item.platformLabels.map((platform) => platform.id))).size

  return {
    totalCustomers,
    totalOrders,
    totalSpend,
    averageOrderValue,
    activePlatforms,
  }
}

export function buildCRMCustomerProfilesResponse(params: {
  search?: string
  customerId?: string
} = {}): CRMCustomerProfilesResponse {
  const keyword = params.search?.trim().toLowerCase() ?? ''

  const filtered = customerProfiles.filter((customer) => {
    if (!keyword) return true

    return [customer.fullName, customer.customerCode, customer.maskedPhone, customer.email]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  const customers = filtered.map(buildListItem)
  const selectedCustomer =
    filtered.find((customer) => customer.id === params.customerId) ?? filtered[0] ?? null

  return {
    summary: buildCRMCustomerProfilesSummary(filtered),
    customers,
    selectedCustomerId: selectedCustomer?.id ?? '',
    selectedCustomer,
  }
}

export const crmCustomerProfilesMock = customerProfiles