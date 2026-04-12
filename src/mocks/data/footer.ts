import type { PlatformCode } from '@/types/platform.types'

type FooterLinkItemMock = {
  id: string
  label: string
  href: string
  external?: boolean
}

type FooterLinkGroupMock = {
  id: string
  title: string
  links: FooterLinkItemMock[]
}

type FooterMarketplaceMock = {
  id: string
  code: PlatformCode
  label: string
  status: 'healthy' | 'degraded' | 'offline'
  uptimeRate: number
  lastSyncLabel: string
}

export type FooterSnapshotMock = {
  brandName: string
  headline: string
  description: string
  supportEmail: string
  supportPhone: string
  updatedAt: string
  legalNotice: string
  groups: FooterLinkGroupMock[]
  marketplaces: FooterMarketplaceMock[]
}

export const footerSnapshotMock: FooterSnapshotMock = {
  brandName: 'ShopHub',
  headline: 'Điều phối đa sàn mượt mà cho đội vận hành tăng trưởng',
  description:
    'Tập trung quản trị đơn hàng, tồn kho và doanh thu giữa Shopee, TikTok Shop và Lazada trên cùng một workspace.',
  supportEmail: 'support@shophub.vn',
  supportPhone: '+84 28 7303 8899',
  updatedAt: '2026-04-04T09:15:00.000Z',
  legalNotice: 'Bảo lưu mọi quyền. Điều khoản và chính sách áp dụng cho tài khoản doanh nghiệp.',
  groups: [
    {
      id: 'product',
      title: 'Sản phẩm',
      links: [
        { id: 'inventory', label: 'Quản lý tồn kho', href: '/inventory' },
        { id: 'orders', label: 'Điều phối đơn hàng', href: '/orders' },
        { id: 'pricing', label: 'Theo dõi giá đối thủ', href: '/products' },
      ],
    },
    {
      id: 'resources',
      title: 'Tài nguyên',
      links: [
        { id: 'docs', label: 'Trung tâm tài liệu', href: '/settings' },
        { id: 'api', label: 'API trạng thái hệ thống', href: '/integrations' },
        { id: 'roadmap', label: 'Roadmap quý', href: '/dashboard' },
      ],
    },
    {
      id: 'company',
      title: 'Doanh nghiệp',
      links: [
        { id: 'about', label: 'Về ShopHub', href: '/settings' },
        { id: 'policy', label: 'Chính sách bảo mật', href: '/settings' },
        { id: 'status', label: 'Trạng thái kết nối sàn', href: '/settings' },
      ],
    },
  ],
  marketplaces: [
    {
      id: 'market-lazada',
      code: 'lazada',
      label: 'Lazada',
      status: 'healthy',
      uptimeRate: 99.94,
      lastSyncLabel: 'Đồng bộ 2 phút trước',
    },
    {
      id: 'market-shopee',
      code: 'shopee',
      label: 'Shopee',
      status: 'healthy',
      uptimeRate: 99.81,
      lastSyncLabel: 'Đồng bộ 3 phút trước',
    },
    {
      id: 'market-tiktok',
      code: 'tiktok_shop',
      label: 'TikTok Shop',
      status: 'degraded',
      uptimeRate: 98.72,
      lastSyncLabel: 'Đồng bộ 8 phút trước',
    },
  ],
}