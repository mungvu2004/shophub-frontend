export type PlatformCode = "lazada" | "shopee" | "tiktok_shop"; // Source: Platforms.Code | nullable: no

export interface Platform {
  id: number; // Source: Platforms.Id | nullable: no
  code: PlatformCode; // Source: Platforms.Code | nullable: no
  name: string; // Source: Platforms.Name | nullable: no
  region: string; // Source: Platforms.Region | nullable: no
  isActive: boolean; // Source: Platforms.IsActive | nullable: no
}

export interface PlatformConnection {
  id: string; // Source: PlatformConnections.Id | nullable: no
  sellerId: string; // Source: PlatformConnections.SellerId | nullable: no
  platformId: number; // Source: PlatformConnections.PlatformId | nullable: no
  platform: Platform; // Source: Joined Platforms record | nullable: no
  appKey: string; // Source: PlatformConnections.AppKey | nullable: no
  externalShopId: string; // Source: PlatformConnections.ExternalShopId | nullable: no
  externalShopName?: string; // Source: PlatformConnections.ExternalShopName | nullable: yes
  externalSellerId?: string; // Source: PlatformConnections.ExternalSellerId | nullable: yes
  country?: string; // Source: PlatformConnections.Country | nullable: yes
  status: "Active" | "TokenExpired" | "RefreshFailed" | "Disconnected"; // Source: PlatformConnections.Status | nullable: no
  connectedAt: string; // Source: PlatformConnections.ConnectedAt | nullable: no
  lastTokenRefreshedAt?: string; // Source: PlatformConnections.LastTokenRefreshedAt | nullable: yes
  lastSyncAt?: string; // Source: PlatformConnections.LastSyncAt | nullable: yes
  isActive: boolean; // Source: PlatformConnections.IsActive | nullable: no

  // Backend-only fields intentionally excluded:
  // AccessToken, RefreshToken, AccessTokenExpiresAt, RawTokenPayload
}
