import type {
  FooterMarketplaceStatus,
  FooterSnapshot,
  FooterViewModel,
} from '@/features/footer/logic/footer.types'

const statusLabelMap: Record<FooterMarketplaceStatus, string> = {
  healthy: 'Ổn định',
  degraded: 'Giảm hiệu năng',
  offline: 'Mất kết nối',
}

const toUpdatedLabel = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Cập nhật gần đây'
  }

  return `Cập nhật ${date.toLocaleString('vi-VN')}`
}

export function buildFooterViewModel(snapshot: FooterSnapshot): FooterViewModel {
  const healthyCount = snapshot.marketplaces.filter((item) => item.status === 'healthy').length

  return {
    brandName: snapshot.brandName,
    headline: snapshot.headline,
    description: snapshot.description,
    supportEmail: snapshot.supportEmail,
    supportPhone: snapshot.supportPhone,
    groups: snapshot.groups,
    marketplaces: snapshot.marketplaces.map((item) => ({
      ...item,
      statusLabel: statusLabelMap[item.status],
    })),
    healthSummary: `${healthyCount}/${snapshot.marketplaces.length} sàn đang ổn định`,
    updatedLabel: toUpdatedLabel(snapshot.updatedAt),
    copyrightLabel: `© ${new Date().getFullYear()} ${snapshot.brandName}. ${snapshot.legalNotice}`,
  }
}