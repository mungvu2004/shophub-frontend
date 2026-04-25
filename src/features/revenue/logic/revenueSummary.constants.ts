/**
 * Revenue Charts Constants
 * Dùng để cấu hình màu sắc, phông chữ và các giá trị mặc định cho biểu đồ doanh thu.
 * Tuân thủ tuyệt đối quy tắc: Không hard-code trong file UI.
 */

export const REVENUE_COLORS = {
  SHOPEE: '#EE4D2D',
  TIKTOK: '#010101',
  LAZADA: '#8B5CF6',
  PREVIOUS: '#94A3B8', // Slate-400 cho so sánh kỳ trước
  SUCCESS: '#16A34A',  // Success-600
  DANGER: '#DC2626',   // Danger-600
  WARNING: '#D97706',  // Warning-600
  PRIMARY: '#6366F1',  // Indigo-500 (Brand Primary)
} as const

export const CHART_CONFIG = {
  FONT_FAMILY_MONO: 'var(--font-mono)',
  TICK_COLOR: '#64748B', // Slate-500
  GRID_COLOR: '#E2E8F0', // Slate-200
  TOOLTIP_BG: '#FFFFFF',
  TOOLTIP_BORDER: '#E2E8F0',
} as const

export const REVENUE_LAYOUT = {
  TOP_PRODUCTS_LIMIT: 10,
  CHART_ASPECT_RATIO: 3 / 2, // Tỉ lệ vàng cho biểu đồ chính
} as const
