import {
  ArrowLeftRight,
  BarChart3,
  Banknote,
  Boxes,
  Brain,
  ChartNoAxesColumn,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  MessageSquareMore,
  Package,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

export type SidebarNavChild = {
  label: string
  to: string
  icon: LucideIcon
}

export type SidebarNavSection = {
  label: string
  icon: LucideIcon
  children: readonly SidebarNavChild[]
}

export const navItems: readonly SidebarNavSection[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'KPI Overview', to: '/dashboard/kpi-overview', icon: ChartNoAxesColumn },
      { label: 'Revenue Charts', to: '/dashboard/revenue-charts', icon: TrendingUp },
      { label: 'Top Products', to: '/dashboard/top-products', icon: PackageCheck },
      {
        label: 'Alerts & Notifications',
        to: '/dashboard/alerts-notifications',
        icon: MessageSquareMore,
      },
    ],
  },
  {
    label: 'Đơn hàng',
    icon: ShoppingCart,
    children: [
      { label: 'Danh sách đơn', to: '/orders/all', icon: ClipboardList },
      { label: 'Cần xử lý', to: '/orders/pending-actions', icon: Sparkles },
      { label: 'Hoàn/Huỷ', to: '/orders/returns', icon: RotateCcw },
    ],
  },
  {
    label: 'Kho hàng',
    icon: Boxes,
    children: [
      { label: 'Tồn kho SKU', to: '/inventory/sku-stock', icon: Warehouse },
      { label: 'Nhập/Xuất kho', to: '/inventory/stock-movements', icon: ArrowLeftRight },
      { label: 'Dự báo AI', to: '/inventory/ai-forecast', icon: Brain },
    ],
  },
  {
    label: 'Doanh thu',
    icon: Banknote,
    children: [
      { label: 'Báo cáo tổng hợp', to: '/revenue/summary-report', icon: BarChart3 },
      { label: 'So sánh sàn', to: '/revenue/platform-comparison', icon: ChartNoAxesColumn },
      { label: 'Dự báo ML', to: '/revenue/ml-forecast', icon: Sparkles },
    ],
  },
  {
    label: 'Sản phẩm & Giá',
    icon: Package,
    children: [
      { label: 'Danh sách sản phẩm', to: '/products/list', icon: Store },
      { label: 'Định giá động', to: '/products/dynamic-pricing', icon: SlidersHorizontal },
      { label: 'Theo dõi đối thủ', to: '/products/competitor-tracking', icon: PackageSearch },
    ],
  },
  {
    label: 'CRM & Review',
    icon: MessageCircle,
    children: [
      { label: 'Phân tích sentiment', to: '/crm/sentiment-analysis', icon: Brain },
      { label: 'Hộp thư review', to: '/crm/review-inbox', icon: MessageSquareMore },
      { label: 'Hồ sơ khách hàng', to: '/crm/customer-profiles', icon: Users },
    ],
  },
  {
    label: 'Cài đặt',
    icon: Settings,
    children: [
      { label: 'Kết nối sàn', to: '/settings/platform-connections', icon: Store },
      { label: 'Phân quyền nhân viên', to: '/settings/staff-permissions', icon: ShieldCheck },
      { label: 'Tự động hóa', to: '/settings/automation', icon: Sparkles },
    ],
  },
]
