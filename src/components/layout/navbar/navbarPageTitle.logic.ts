export function resolvePageTitle(pathname: string) {
  const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/kpi-overview': 'KPI Overview',
    '/dashboard/revenue-charts': 'Revenue Charts',
    '/dashboard/top-products': 'Top Products',
    '/dashboard/alerts-notifications': 'Alerts & Notifications',
    '/orders/all': 'Danh sách đơn',
    '/orders/pending-actions': 'Cần xử lý',
    '/orders/returns': 'Hoàn/Huỷ',
    '/inventory/sku-stock': 'Tồn kho SKU',
    '/inventory/stock-movements': 'Nhập/Xuất kho',
    '/inventory/ai-forecast': 'Dự báo AI',
    '/revenue/summary-report': 'Báo cáo tổng hợp',
    '/revenue/platform-comparison': 'So sánh sàn',
    '/revenue/ml-forecast': 'Dự báo ML',
    '/products/list': 'Danh sách sản phẩm',
    '/products/dynamic-pricing': 'Định giá động',
    '/products/competitor-tracking': 'Theo dõi đối thủ',
    '/crm/sentiment-analysis': 'Phân tích sentiment',
    '/crm/review-inbox': 'Hộp thư review',
    '/crm/customer-profiles': 'Hồ sơ khách hàng',
    '/settings/profile': 'Profile settings',
    '/settings/platform-connections': 'Kết nối sàn',
    '/settings/staff-permissions': 'Phân quyền nhân viên',
    '/settings/automation': 'Tự động hóa',
  }

  if (titleMap[pathname]) {
    return titleMap[pathname]
  }

  if (pathname.startsWith('/orders/')) {
    return 'Đơn hàng'
  }

  if (pathname.startsWith('/inventory/adjust')) {
    return 'Điều chỉnh tồn kho'
  }

  if (pathname.startsWith('/products/')) {
    return 'Sản phẩm'
  }

  if (pathname.startsWith('/platforms/callback/')) {
    return 'Kết nối sàn'
  }

  const lastSegment = pathname.split('/').filter(Boolean).pop()
  return lastSegment || 'Dashboard'
}
