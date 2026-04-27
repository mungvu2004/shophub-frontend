import type { ProductQuickStatData, ProductInsightsData, ProductStatusCounts } from '@/features/products/logic/productsListPage.types'

export const MOCK_QUICK_STATS: ProductQuickStatData[] = [
  { title: 'Cần nhập hàng', value: '12', description: 'Sản phẩm dưới định mức', iconType: 'package', colorTone: 'rose' },
  { title: 'Lỗi đồng bộ', value: '3', description: 'Cần kiểm tra trên Shopee', iconType: 'cloud', colorTone: 'amber' },
  { title: 'Chưa tối ưu SEO', value: '28', description: 'Điểm chất lượng < 70', iconType: 'alert', colorTone: 'indigo' },
  { title: 'Giá trị Tồn kho', value: '1.2B', description: 'Tổng vốn đọng dự kiến', iconType: 'dollar', colorTone: 'emerald' },
]

export const MOCK_INSIGHTS_DATA: ProductInsightsData = {
  categoryPerformance: [
    { name: 'Áo thun', sales: 4000, stock: 2400 },
    { name: 'Váy nữ', sales: 3000, stock: 1398 },
    { name: 'Quần nam', sales: 2000, stock: 9800 },
    { name: 'Áo sơ mi', sales: 2780, stock: 3908 },
    { name: 'Áo khoác', sales: 1890, stock: 4800 },
  ],
  platformAllocation: [
    { name: 'Shopee', value: 45, color: '#f97316' }, 
    { name: 'TikTok', value: 30, color: '#0f172a' }, 
    { name: 'Lazada', value: 25, color: '#4f46e5' }, 
  ]
}

export const MOCK_STATUS_COUNTS: ProductStatusCounts = {
  all: 120,
  active: 85,
  inactive: 23,
  deleted: 12
}
