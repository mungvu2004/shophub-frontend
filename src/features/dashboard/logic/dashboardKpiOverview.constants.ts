import type { MetricCardData, MonthlyGoalData, PlatformTab } from '@/features/dashboard/logic/dashboardKpiOverview.types'

export const DEFAULT_NO_DATA_HINT = ''

export const PLACEHOLDER_TABS: PlatformTab[] = [
  { id: 'all', label: 'Tất cả', count: '(--)' },
  { id: 'shopee', label: 'Shopee', count: '(--)', dotColor: '#F97316' },
  { id: 'lazada', label: 'Lazada', count: '(--)', dotColor: '#2563EB' },
  { id: 'tiktok', label: 'TikTok Shop', count: '(--)', dotColor: '#0F172A' },
]

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
  },
]
