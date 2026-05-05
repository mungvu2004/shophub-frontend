import type { CompetitorTrackingPayload } from '@/features/products/logic/productsCompetitorTracking.types'

export const productsCompetitorTrackingMock: CompetitorTrackingPayload = {
  alertBanner: {
    matchedCount: 5,
    message: 'đối thủ vừa giảm giá dưới mức của bạn',
  },
  totalProductsTracked: 47,
  comparisonRows: Array.from({ length: 47 }, (_, idx) => {
    const n = idx + 1;
    const platforms = ['shopee', 'lazada', 'tiktok_shop'] as const;
    const platform = platforms[n % 3];
    const productIds = [
      'prod-001', 'prod-003', 'prod-005', 'prod-008', 'prod-010', 'prod-012', 'prod-015',
      'prod-018', 'prod-020', 'prod-022', 'prod-025', 'prod-028', 'prod-030', 'prod-032',
      'prod-035', 'prod-038', 'prod-040', 'prod-042', 'prod-045', 'prod-048', 'prod-050',
      'prod-052', 'prod-055', 'prod-058', 'prod-060', 'prod-002', 'prod-004', 'prod-006',
      'prod-007', 'prod-009', 'prod-011', 'prod-013', 'prod-014', 'prod-016', 'prod-017',
      'prod-019', 'prod-021', 'prod-023', 'prod-024', 'prod-026', 'prod-027', 'prod-029',
      'prod-031', 'prod-033', 'prod-034', 'prod-036', 'prod-037',
    ];
    const productNames = [
      'Áo thun basic XS', 'Áo thun basic S', 'Áo thun basic M', 'Áo thun basic L', 'Áo thun basic XL',
      'Áo thun basic XXL', 'Áo polo nam', 'Áo sơ mi trắng', 'Áo sơ mi xanh', 'Áo khoác gió',
      'Áo khoác denim', 'Áo khoác len', 'Quần jean nam slim', 'Quần jean nam regular', 'Quần jean nữ slim',
      'Quần jean nữ regular', 'Quần short nam', 'Quần short nữ', 'Quần tây nam', 'Quần tây nữ',
      'Váy xòe đuôi cá', 'Váy đính hạt', 'Váy hoa nhí', 'Váy bút chì', 'Váy maxi',
      'Giày sneaker trắng', 'Giày sneaker đen', 'Giày canvas', 'Giày lười nam', 'Giày lười nữ',
      'Giày boot', 'Giày sandal', 'Dép quai', 'Vòng tay', 'Dây chuyền vàng',
      'Dây chuyền bạc', 'Khuyên tai', 'Nhẫn', 'Túi xách', 'Ví cầm tay',
      'Thắt lưng da', 'Khăn quàng', 'Mũ lưỡi trai', 'Nón len', 'Kính mát',
    ];
    
    const basePrice = 150000 + (n % 5) * 50000;
    const marketAvg = basePrice * (0.85 + (n % 10) * 0.02);
    const lowestPrice = basePrice * (0.70 + (n % 8) * 0.02);
    const rank = 1 + (n % 12);
    const totalCompetitors = 6 + (n % 15);
    const trends = ['up', 'down', 'stable'] as const;
    const trend = trends[n % 3];
    
    return {
      id: `cmp-${String(n).padStart(3, '0')}`,
      productId: productIds[n % productIds.length],
      productName: productNames[n % productNames.length],
      yourPrice: Math.round(basePrice),
      marketAveragePrice: Math.round(marketAvg),
      lowestMarketPrice: Math.round(lowestPrice),
      rank,
      totalCompetitors,
      trend,
      platform,
    };
  }),
  topCompetitors: [
    {
      id: 'top-001',
      shopName: 'Fashion Hub Store',
      platform: 'shopee',
      score: 4.8,
      productCount: 24,
      lastUpdatedHours: 2,
    },
    {
      id: 'top-002',
      shopName: 'Yody Official',
      platform: 'tiktok_shop',
      score: 4.9,
      productCount: 18,
      lastUpdatedHours: 1,
    },
    {
      id: 'top-003',
      shopName: 'LazMall Fashion Plus',
      platform: 'lazada',
      score: 4.7,
      productCount: 22,
      lastUpdatedHours: 3,
    },
  ],
  alertSettings: {
    thresholdPercent: 8,
    updatedAt: '2026-05-05T10:00:00.000Z',
  },
  heatmap: [
    {
      category: 'Áo thun',
      buckets: [
        { rangeLabel: '0-100k', totalCompetitors: 2 },
        { rangeLabel: '100k-250k', totalCompetitors: 8 },
        { rangeLabel: '250k-500k', totalCompetitors: 15 },
        { rangeLabel: '500k-1tr', totalCompetitors: 12 },
        { rangeLabel: '1tr-2tr', totalCompetitors: 5 },
        { rangeLabel: '2tr+', totalCompetitors: 1 },
      ],
    },
    {
      category: 'Quần jean',
      buckets: [
        { rangeLabel: '0-100k', totalCompetitors: 0 },
        { rangeLabel: '100k-250k', totalCompetitors: 6 },
        { rangeLabel: '250k-500k', totalCompetitors: 11 },
        { rangeLabel: '500k-1tr', totalCompetitors: 18 },
        { rangeLabel: '1tr-2tr', totalCompetitors: 14 },
        { rangeLabel: '2tr+', totalCompetitors: 4 },
      ],
    },
    {
      category: 'Váy/Đầm',
      buckets: [
        { rangeLabel: '0-100k', totalCompetitors: 14 },
        { rangeLabel: '100k-250k', totalCompetitors: 22 },
        { rangeLabel: '250k-500k', totalCompetitors: 16 },
        { rangeLabel: '500k-1tr', totalCompetitors: 10 },
        { rangeLabel: '1tr-2tr', totalCompetitors: 8 },
        { rangeLabel: '2tr+', totalCompetitors: 5 },
      ],
    },
    {
      category: 'Phụ kiện',
      buckets: [
        { rangeLabel: '0-100k', totalCompetitors: 9 },
        { rangeLabel: '100k-250k', totalCompetitors: 18 },
        { rangeLabel: '250k-500k', totalCompetitors: 25 },
        { rangeLabel: '500k-1tr', totalCompetitors: 10 },
        { rangeLabel: '1tr-2tr', totalCompetitors: 6 },
        { rangeLabel: '2tr+', totalCompetitors: 15 },
      ],
    },
  ],
}
