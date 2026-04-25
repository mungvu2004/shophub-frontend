/**
 * Inventory Module Constants
 * Quản lý tập trung cấu hình, màu sắc và layout cho phân hệ Kho hàng.
 */

export const INVENTORY_COLORS = {
  // Brand Platforms
  SHOPEE: '#EE4D2D',
  TIKTOK: '#000000',
  LAZADA: '#1019D1',
  
  // Category Groups (Pastel Soft)
  CAT_AO: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  CAT_VAY: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
  CAT_QUAN: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  CAT_GIAY: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  CAT_PHUKIEN: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  CAT_DEFAULT: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' },
} as const;

export const ACTION_MENU_CONFIG = {
  RADIUS: 72,
  START_ANGLE: 120,
  END_ANGLE: 240,
  ANIMATION_DURATION: 300,
} as const;

export const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Điện tử' },
  { value: 'clothing', label: 'Thời trang' },
  { value: 'home', label: 'Nhà cửa' },
];

export const PLATFORM_OPTIONS = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'tiktok', label: 'TikTok Shop' },
  { value: 'lazada', label: 'Lazada' },
];

export const STATUS_OPTIONS = [
  { value: 'normal', label: 'Bình thường' },
  { value: 'warning', label: 'Tồn kho thấp' },
  { value: 'critical', label: 'Hết hàng' },
];

export const INVENTORY_STATUS_CONFIG = {
  normal: { 
    label: 'Bình thường', 
    bgColor: 'bg-emerald-50', 
    textColor: 'text-emerald-900', 
    dotColor: 'bg-emerald-600', 
    indicatorColor: 'bg-emerald-500' 
  },
  warning: { 
    label: 'Thấp', 
    bgColor: 'bg-amber-50', 
    textColor: 'text-amber-900', 
    dotColor: 'bg-amber-600', 
    indicatorColor: 'bg-amber-500' 
  },
  critical: { 
    label: 'Hết hàng', 
    bgColor: 'bg-red-50', 
    textColor: 'text-red-900', 
    dotColor: 'bg-red-600', 
    indicatorColor: 'bg-red-500' 
  },
  discontinued: { 
    label: 'Ngừng bán', 
    bgColor: 'bg-slate-50', 
    textColor: 'text-slate-900', 
    dotColor: 'bg-slate-600', 
    indicatorColor: 'bg-slate-400' 
  },
} as const;
