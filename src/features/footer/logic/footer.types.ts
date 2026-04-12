import type { PlatformCode } from '@/types/platform.types'

export type FooterLinkItem = {
  id: string
  label: string
  href: string
  external?: boolean
}

export type FooterLinkGroup = {
  id: string
  title: string
  links: FooterLinkItem[]
}

export type FooterMarketplaceStatus = 'healthy' | 'degraded' | 'offline'

export type FooterMarketplace = {
  id: string
  code: PlatformCode
  label: string
  status: FooterMarketplaceStatus
  uptimeRate: number
  lastSyncLabel: string
}

export type FooterSnapshot = {
  brandName: string
  headline: string
  description: string
  supportEmail: string
  supportPhone: string
  updatedAt: string
  legalNotice: string
  groups: FooterLinkGroup[]
  marketplaces: FooterMarketplace[]
}

export type FooterMarketplaceCardViewModel = FooterMarketplace & {
  statusLabel: string
}

export type FooterViewModel = {
  brandName: string
  headline: string
  description: string
  supportEmail: string
  supportPhone: string
  groups: FooterLinkGroup[]
  marketplaces: FooterMarketplaceCardViewModel[]
  healthSummary: string
  updatedLabel: string
  copyrightLabel: string
}