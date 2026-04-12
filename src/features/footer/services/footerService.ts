import { apiClient } from '@/services/apiClient'
import type { PlatformCode } from '@/types/platform.types'

import type {
  FooterLinkGroup,
  FooterMarketplace,
  FooterMarketplaceStatus,
  FooterSnapshot,
} from '@/features/footer/logic/footer.types'

type FooterApiPayload = Partial<FooterSnapshot>

const platformCodes: PlatformCode[] = ['lazada', 'shopee', 'tiktok_shop']

const toPlatformCode = (value: unknown): PlatformCode => {
  if (typeof value === 'string' && platformCodes.includes(value as PlatformCode)) {
    return value as PlatformCode
  }

  return 'lazada'
}

const toStatus = (value: unknown): FooterMarketplaceStatus => {
  if (value === 'degraded' || value === 'offline') {
    return value
  }

  return 'healthy'
}

const toLinkGroups = (value: unknown): FooterLinkGroup[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((group, index) => ({
      id: typeof group.id === 'string' ? group.id : `group-${index}`,
      title: typeof group.title === 'string' ? group.title : 'Nhóm liên kết',
      links: Array.isArray(group.links)
        ? group.links
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((link, linkIndex) => ({
            id: typeof link.id === 'string' ? link.id : `link-${index}-${linkIndex}`,
            label: typeof link.label === 'string' ? link.label : 'Liên kết',
            href: typeof link.href === 'string' ? link.href : '/dashboard',
            external: link.external === true,
          }))
        : [],
    }))
}

const toMarketplaces = (value: unknown): FooterMarketplace[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((entry, index) => ({
      id: typeof entry.id === 'string' ? entry.id : `market-${index}`,
      code: toPlatformCode(entry.code),
      label: typeof entry.label === 'string' ? entry.label : 'Marketplace',
      status: toStatus(entry.status),
      uptimeRate: typeof entry.uptimeRate === 'number' && Number.isFinite(entry.uptimeRate) ? entry.uptimeRate : 0,
      lastSyncLabel: typeof entry.lastSyncLabel === 'string' ? entry.lastSyncLabel : 'Vừa cập nhật',
    }))
}

const defaultSnapshot: FooterSnapshot = {
  brandName: 'ShopHub',
  headline: 'Điều phối đa sàn mượt mà cho đội vận hành tăng trưởng',
  description: 'Đồng bộ dữ liệu từ tất cả kênh bán để đội vận hành theo dõi nhanh và hành động chính xác.',
  supportEmail: 'support@shophub.vn',
  supportPhone: '+84 28 7303 8899',
  updatedAt: new Date().toISOString(),
  legalNotice: 'Bảo lưu mọi quyền.',
  groups: [],
  marketplaces: [],
}

class FooterService {
  async getFooterSnapshot(): Promise<FooterSnapshot> {
    const response = await apiClient.get<{
      data?: FooterApiPayload
    }>('/footer')

    const payload = response.data?.data

    return {
      brandName: payload?.brandName ?? defaultSnapshot.brandName,
      headline: payload?.headline ?? defaultSnapshot.headline,
      description: payload?.description ?? defaultSnapshot.description,
      supportEmail: payload?.supportEmail ?? defaultSnapshot.supportEmail,
      supportPhone: payload?.supportPhone ?? defaultSnapshot.supportPhone,
      updatedAt: payload?.updatedAt ?? defaultSnapshot.updatedAt,
      legalNotice: payload?.legalNotice ?? defaultSnapshot.legalNotice,
      groups: toLinkGroups(payload?.groups),
      marketplaces: toMarketplaces(payload?.marketplaces),
    }
  }
}

export const footerService = new FooterService()