import type {
  DynamicPricingPayload,
} from '@/features/products/logic/productsDynamicPricing.types'

const buildPlaceholderImage = (label: string, bgColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect width="72" height="72" rx="10" fill="${bgColor}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#ffffff">${label}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const priceByDay = (start: number, deltas: number[]) => {
  const values: number[] = []
  let current = start
  deltas.forEach((delta) => {
    current += delta
    values.push(current)
  })
  return values
}

const dateLabels = ['01 Th05', '05 Th05', '10 Th05', '15 Th05', '20 Th05', '25 Th05', '30 Th05']
const shopeeSeries = priceByDay(141000, [0, 1000, -2000, 3000, -1000, 3500, -1800])
const tiktokSeries = priceByDay(138500, [0, 500, 1200, -900, 2800, -1300, 900])
const lazadaSeries = priceByDay(140500, [0, -700, 1500, -800, 1700, -900, 1000])
const competitorSeries = priceByDay(143000, [0, 300, -400, 600, -200, 200, -300])

const recommendationSeeds = [
  { id: 'rec-001', productId: 'prod-001', productName: 'Áo thun basic trắng L', sku: 'TS-WHT-L', platform: 'shopee' as const, currentPrice: 150000, aiPrice: 142000, changePercent: -5.3, reason: 'Đối thủ hạ giá -8%', confidence: 3, imageLabel: 'TS', imageColor: '#7c3aed' },
  { id: 'rec-002', productId: 'prod-012', productName: 'Áo hoodie unisex - Size M', sku: 'SKU-012', platform: 'tiktok_shop' as const, currentPrice: 890000, aiPrice: 920000, changePercent: 3.4, reason: 'Nhu cầu tăng đột biến', confidence: 4, imageLabel: 'SH', imageColor: '#ea580c' },
  { id: 'rec-003', productId: 'prod-024', productName: 'Áo sơ mi công sở nữ - Size S', sku: 'SKU-024', platform: 'lazada' as const, currentPrice: 450000, aiPrice: 435000, changePercent: -3.3, reason: 'Flash sale đối thủ', confidence: 2, imageLabel: 'BG', imageColor: '#0ea5e9' },
  { id: 'rec-004', productId: 'prod-029', productName: 'Váy xòe cổ điển - Size M', sku: 'SKU-029', platform: 'lazada' as const, currentPrice: 670000, aiPrice: 639000, changePercent: -4.6, reason: 'Cạnh tranh giá mua lẻ', confidence: 4, imageLabel: 'JK', imageColor: '#475569' },
  { id: 'rec-005', productId: 'prod-031', productName: 'Quần short jean nữ - Size M', sku: 'SKU-031', platform: 'shopee' as const, currentPrice: 520000, aiPrice: 538000, changePercent: 3.5, reason: 'Doanh số 7 ngày tăng', confidence: 4, imageLabel: 'DR', imageColor: '#16a34a' },
  { id: 'rec-006', productId: 'prod-045', productName: 'Áo khoác denim - Size 32', sku: 'SKU-045', platform: 'tiktok_shop' as const, currentPrice: 390000, aiPrice: 376000, changePercent: -3.6, reason: 'Tỷ lệ rời giỏ cao', confidence: 3, imageLabel: 'PT', imageColor: '#0891b2' },
  { id: 'rec-007', productId: 'prod-005', productName: 'Áo khoác denim - Size M', sku: 'SKU-005', platform: 'shopee' as const, currentPrice: 280000, aiPrice: 265000, changePercent: -5.4, reason: 'Stock cao, bán chậm', confidence: 3, imageLabel: 'KK', imageColor: '#d97706' },
  { id: 'rec-008', productId: 'prod-008', productName: 'Áo phông nam cotton - Size L', sku: 'SKU-008', platform: 'lazada' as const, currentPrice: 420000, aiPrice: 442000, changePercent: 5.2, reason: 'Xu hướng tăng giá', confidence: 4, imageLabel: 'SM', imageColor: '#e5e7eb' },
  { id: 'rec-009', productId: 'prod-015', productName: 'Áo tank top nữ - Black', sku: 'SKU-015', platform: 'tiktok_shop' as const, currentPrice: 125000, aiPrice: 118000, changePercent: -5.6, reason: 'Cạnh tranh mạnh', confidence: 3, imageLabel: 'CP', imageColor: '#1f2937' },
  { id: 'rec-010', productId: 'prod-020', productName: 'Váy chữ A cổ điển - Size M', sku: 'SKU-020', platform: 'shopee' as const, currentPrice: 185000, aiPrice: 192000, changePercent: 3.8, reason: 'Phần trăm lợi nhuận thấp', confidence: 4, imageLabel: 'BL', imageColor: '#92400e' },
  { id: 'rec-011', productId: 'prod-035', productName: 'Áo tank top nữ - Dài tay', sku: 'SKU-035', platform: 'lazada' as const, currentPrice: 310000, aiPrice: 295000, changePercent: -4.8, reason: 'Mùa hè kém', confidence: 2, imageLabel: 'LS', imageColor: '#6b7280' },
  { id: 'rec-012', productId: 'prod-040', productName: 'Váy chữ A cổ điển - Size L', sku: 'SKU-040', platform: 'shopee' as const, currentPrice: 590000, aiPrice: 615000, changePercent: 4.2, reason: 'Chất lượng cao, stock giới hạn', confidence: 4, imageLabel: 'JL', imageColor: '#fbbf24' },
  { id: 'rec-013', productId: 'prod-011', productName: 'Quần short jean nữ - Size S', sku: 'SKU-011', platform: 'tiktok_shop' as const, currentPrice: 380000, aiPrice: 368000, changePercent: -3.2, reason: 'Seasonal trend', confidence: 3, imageLabel: 'SK', imageColor: '#fca5a5' },
  { id: 'rec-014', productId: 'prod-018', productName: 'Quần chino nam thời trang - Size L', sku: 'SKU-018', platform: 'lazada' as const, currentPrice: 550000, aiPrice: 573000, changePercent: 4.2, reason: 'Hàng bán chạy Q2', confidence: 4, imageLabel: 'PT', imageColor: '#111827' },
  { id: 'rec-015', productId: 'prod-055', productName: 'Áo tank top nữ - Premium', sku: 'SKU-055', platform: 'shopee' as const, currentPrice: 350000, aiPrice: 332000, changePercent: -5.1, reason: 'Giá cơ sở cao', confidence: 3, imageLabel: 'PL', imageColor: '#1e40af' },
]

export const productsDynamicPricingMock: DynamicPricingPayload = {
  title: 'Định giá Động',
  subtitle: 'AI gợi ý giá tối ưu dựa trên đối thủ + nhu cầu thị trường',
  recommendationsTitle: 'Gợi ý giá AI - Chờ xác nhận',
  applyAllLabel: 'Áp dụng giá AI hàng loạt',
  historyLabel: 'Lịch sử thay đổi giá',
  tableHeaders: {
    product: 'Sản phẩm',
    platform: 'Sàn',
    pricing: 'Phân tích giá',
    confidence: 'Độ tin cậy',
    actions: 'Xác nhận',
  },
  approveLabel: 'Duyệt',
  periodLabel: '30 ngày qua',
  totalSuggestions: 47,
  displayedSuggestions: recommendationSeeds.length,
  selectedProductName: 'Áo thun basic trắng L',
  rules: [
    { id: 'rule-1', title: 'Thấp hơn đối thủ 5%', description: 'Áp dụng: 234 sản phẩm', icon: 'trend', appliedProducts: 234, platforms: ['shopee', 'tiktok_shop', 'lazada'], isActive: true, status: 'active' },
    { id: 'rule-2', title: 'Tối thiểu lợi nhuận 20%', description: 'Bảo vệ biên lợi nhuận', icon: 'shield', appliedProducts: 234, platforms: ['shopee', 'tiktok_shop', 'lazada'], tag: 'Bảo vệ biên lợi nhuận', isActive: true, status: 'active' },
    { id: 'rule-3', title: 'Khuyến mãi cuối tuần -10%', description: 'T7, CN', icon: 'calendar', appliedProducts: 0, platforms: ['lazada'], scheduleText: 'T7, CN', isActive: false, status: 'inactive' },
  ],
  recommendations: recommendationSeeds.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    imageUrl: buildPlaceholderImage(item.imageLabel, item.imageColor),
    platform: item.platform,
    currentPrice: item.currentPrice,
    aiPrice: item.aiPrice,
    changePercent: item.changePercent,
    reason: item.reason,
    confidence: item.confidence,
  })),
  historyPoints: dateLabels.map((dateLabel, index) => ({
    dateLabel,
    shopeePrice: shopeeSeries[index],
    tiktokPrice: tiktokSeries[index],
    lazadaPrice: lazadaSeries[index],
    competitorAvgPrice: competitorSeries[index],
  })),
  historySummary: { lowestPrice: 139000, averagePrice: 145500 },
  insights: [
    { id: 'insight-1', tone: 'primary', title: 'Dự báo doanh thu', value: '+18.5%', description: 'Nếu áp dụng tất cả 47 gợi ý giá từ AI trong tuần này.' },
    { id: 'insight-2', tone: 'warning', title: 'Cảnh báo biên lợi nhuận', value: '12 sản phẩm', description: 'Đang có giá gần chạm mức tối thiểu 20% lợi nhuận.' },
    { id: 'insight-3', tone: 'success', title: 'Lợi thế cạnh tranh', value: 'Cao hơn 65%', description: 'Cửa hàng bạn đang có giá tốt nhất phân khúc áo thun.' },
  ],
  competitorGaps: [
    { platform: 'Shopee', gapPercent: -4.2, competitorPrice: 155000 },
    { platform: 'TikTok Shop', gapPercent: 2.1, competitorPrice: 148000 },
    { platform: 'Lazada', gapPercent: -1.5, competitorPrice: 152000 },
  ],
}
