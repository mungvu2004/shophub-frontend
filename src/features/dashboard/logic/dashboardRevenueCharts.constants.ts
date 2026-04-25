/**
 * Dashboard Revenue Charts Constants
 * Quản lý màu sắc, cấu hình trục và các tham số UI cho biểu đồ doanh thu Dashboard.
 * Tuân thủ quy tắc: Tuyệt đối không hard-code trong UI.
 */

export const REVENUE_CHART_COLORS = {
  SHOPEE: '#EE4D2D',
  LAZADA: '#6366F1', // Indigo-500
  TIKTOK: '#000000',
  PRIMARY: '#4F46E5', // Indigo-600
  PRIMARY_LIGHT: '#818CF8', // Indigo-400
  VOUCHER: '#16A34A', // Success-600
  PROMOTION: '#D97706', // Warning-600
  FLASH_SALE: '#EA580C', // Orange-600
  FLASH_SALE_TEXT: '#C2410C',
  EVENT: '#0EA5E9', // Sky-500
  EVENT_TEXT: '#0369A1',
  SLATE_200: '#E2E8F0',
  SLATE_300: '#CBD5E1',
  SLATE_400: '#94A3B8',
  SLATE_500: '#64748B',
  SLATE_600: '#475569',
  SLATE_900: '#0F172A',
} as const

export const CATEGORY_CHART_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Rose
  '#8B5CF6', // Violet
  '#0EA5E9', // Sky
] as const

export const HEATMAP_COLORS = {
  LOW: 'oklch(0.95 0.03 244)',
  MEDIUM_LOW: 'oklch(0.89 0.06 248)',
  MEDIUM: 'oklch(0.8 0.11 252)',
  MEDIUM_HIGH: 'oklch(0.72 0.14 258)',
  HIGH: 'oklch(0.64 0.18 264)',
} as const

export const CHART_COMMON_CONFIG = {
  FONT_FAMILY_SANS: 'var(--font-sans)',
  FONT_FAMILY_MONO: 'var(--font-mono)',
  TICK_SIZE: 10,
  AXIS_COLOR: '#94A3B8',
  GRID_COLOR: '#F1F5F9',
  TOOLTIP_BORDER_RADIUS: '12px',
  TOOLTIP_SHADOW: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  XAXIS_PADDING: { left: 0, right: 0 },
  YAXIS_WIDTH: 50,
} as const

export const HOURLY_PEAK_THRESHOLD = {
  START: 19,
  END: 22,
} as const
