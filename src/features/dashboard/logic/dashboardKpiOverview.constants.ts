import type { MetricCardData, MonthlyGoalData, PlatformTab } from '@/features/dashboard/logic/dashboardKpiOverview.types'

export const DEFAULT_NO_DATA_HINT = ''

export const PLACEHOLDER_TABS: PlatformTab[] = [
  { id: 'all', label: 'Tất cả', count: '(0)' },
  { id: 'shopee', label: 'Shopee', count: '(0)', dotColor: '#F97316' },
  { id: 'lazada', label: 'Lazada', count: '(0)', dotColor: '#2563EB' },
  { id: 'tiktok', label: 'TikTok Shop', count: '(0)', dotColor: '#0F172A' },
]

/**
 * Mục tiêu doanh thu mặc định (Mock data/Config)
 * Thực tế có thể lấy từ API Settings hoặc Dashboard Config
 */
export const MONTHLY_REVENUE_GOAL_TARGET = 5000000000 // 5 tỷ VND

export const EXPORT_MESSAGES = {
  PDF_PREPARING: 'Đang chuẩn bị bản in PDF...',
  PDF_INSTRUCTION: 'Vui lòng chọn "Lưu dưới dạng PDF" trong cửa sổ in.',
  PNG_LOADING: 'Đang tạo hình ảnh Dashboard...',
  PNG_SUCCESS: 'Đã chuẩn bị xong hình ảnh!',
  PNG_ERROR: 'Không thể tạo hình ảnh lúc này.',
} as const


export const PLACEHOLDER_MONTHLY_GOAL: MonthlyGoalData = {
  label: 'Mục tiêu tháng',
  currentValue: '--',
  targetValue: '--',
  progressPercent: 0,
}

export const PLACEHOLDER_METRICS: Array<MetricCardData & { isPlaceholder?: boolean }> = [
  {
    id: 'placeholder-1',
    title: 'DOANH THU HÔM NAY',
    value: '--',
    changeLabel: '--',
    changeTone: 'neutral',
    signalTone: 'good',
    accentColor: '#EDE9FE',
    placeholderLayout: 'platform-split',
    breakdown: [
      { label: 'SHOPEE', value: '--' },
      { label: 'LAZADA', value: '--' },
      { label: 'TIKTOK', value: '--' },
    ],
    isPlaceholder: true,
    iconName: 'DollarSign',
  },
  {
    id: 'placeholder-2',
    title: 'TỔNG ĐƠN HÀNG',
    value: '--',
    changeLabel: '--',
    changeTone: 'neutral',
    signalTone: 'good',
    accentColor: '#E2E8F0',
    placeholderLayout: 'platform-split',
    breakdown: [
      { label: 'SHOPEE', value: '--' },
      { label: 'LAZADA', value: '--' },
      { label: 'TIKTOK', value: '--' },
    ],
    isPlaceholder: true,
    iconName: 'ShoppingCart',
  },
  {
    id: 'placeholder-3',
    title: 'CẦN XỬ LÝ NGAY',
    value: '--',
    changeLabel: '--',
    changeTone: 'warning',
    signalTone: 'bad',
    accentColor: '#FFEDD5',
    borderTone: 'warning',
    placeholderLayout: 'alert-summary',
    breakdown: [{ label: '', value: 'Ưu tiên xử lý đơn --' }],
    isPlaceholder: true,
    iconName: 'AlertCircle',
  },
  {
    id: 'placeholder-4',
    title: 'TỶ LỆ HOÀN/HỦY',
    value: '--',
    changeLabel: '--',
    changeTone: 'neutral',
    signalTone: 'good',
    accentColor: '#E2E8F0',
    placeholderLayout: 'rate-compare',
    ratioPercent: 0,
    comparisonPercent: 0,
    comparisonDirection: 'down',
    breakdown: [{ label: 'SO VỚI THÁNG TRƯỚC', value: 'THẤP HƠN 0% SO VỚI THÁNG TRƯỚC' }],
    isPlaceholder: true,
    iconName: 'BarChart3',
  },
]
