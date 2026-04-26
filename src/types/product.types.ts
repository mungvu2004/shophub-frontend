import type { PlatformCode } from "./platform.types";

export type ProductStatus = "Active" | "Inactive" | "Deleted"; // Source: Products.Status | nullable: no

export interface Product {
  id: string; // Source: Products.Id | nullable: no
  sellerId: string; // Source: Products.SellerId | nullable: no
  name: string; // Source: Products.Name | nullable: no
  description?: string; // Source: Products.Description | nullable: yes
  shortDescription?: string; // Source: Products.ShortDescription | nullable: yes
  brand?: string; // Source: Products.Brand | nullable: yes
  model?: string; // Source: Products.Model | nullable: yes
  warrantyInfo?: string; // Source: Products.WarrantyInfo | nullable: yes
  status: ProductStatus; // Source: Products.Status | nullable: no
  source: "manual" | "platform_sync"; // Source: Products.Source | nullable: no
  isDeleted: boolean; // Source: Products.IsDeleted | nullable: no
  createdAt: string; // Source: Products.CreatedAt | nullable: no
  updatedAt: string; // Source: Products.UpdatedAt | nullable: no
  variants: ProductVariant[]; // Source: Joined ProductVariants records | nullable: no

  // Aggregated/Mock Metrics for UI
  stock?: number;
  sold?: number;
  revenue?: number;
  margin?: number;
  qualityScore?: number;
  trendData?: { value: number }[];
}

export interface ProductVariant {
  id: string; // Source: ProductVariants.Id | nullable: no
  productId: string; // Source: ProductVariants.ProductId | nullable: no
  internalSku: string; // Source: ProductVariants.InternalSku | nullable: no
  name?: string; // Source: ProductVariants.Name | nullable: yes
  attributesJson?: Record<string, string>; // Source: ProductVariants.AttributesJson | nullable: yes
  basePrice: number; // Source: ProductVariants.BasePrice | nullable: no
  salePrice?: number; // Source: ProductVariants.SalePrice | nullable: yes
  weight?: number; // Source: ProductVariants.Weight | nullable: yes
  length?: number; // Source: ProductVariants.Length | nullable: yes
  width?: number; // Source: ProductVariants.Width | nullable: yes
  height?: number; // Source: ProductVariants.Height | nullable: yes
  packageContent?: string; // Source: ProductVariants.PackageContent | nullable: yes
  mainImageUrl?: string; // Source: ProductVariants.MainImageUrl | nullable: yes
  imagesJson?: string[]; // Source: ProductVariants.ImagesJson | nullable: yes
  status: "Active" | "Inactive"; // Source: ProductVariants.Status | nullable: no
  isDeleted: boolean; // Source: ProductVariants.IsDeleted | nullable: no
  createdAt: string; // Source: ProductVariants.CreatedAt | nullable: no
  updatedAt: string; // Source: ProductVariants.UpdatedAt | nullable: no
  listings: PlatformSkuMapping[]; // Source: Joined PlatformSkuMappings records | nullable: no
}

export interface PlatformSkuMapping {
  id: number; // Source: PlatformSkuMappings.Id | nullable: no
  variantId: string; // Source: PlatformSkuMappings.VariantId | nullable: no
  connectionId: string; // Source: PlatformSkuMappings.ConnectionId | nullable: no
  platform: PlatformCode; // Source: PlatformSkuMappings.Platform (denormalized) | nullable: no
  externalProductId: string; // Source: PlatformSkuMappings.ExternalProductId | nullable: no
  externalSkuId: string; // Source: PlatformSkuMappings.ExternalSkuId | nullable: no
  externalShopSku?: string; // Source: PlatformSkuMappings.ExternalShopSku | nullable: yes
  externalSellerSku?: string; // Source: PlatformSkuMappings.ExternalSellerSku | nullable: yes
  listingStatus: "active" | "inactive" | "deleted"; // Source: PlatformSkuMappings.ListingStatus | nullable: no
  currentListedPrice?: number; // Source: PlatformSkuMappings.CurrentListedPrice | nullable: yes
  currentSpecialPrice?: number; // Source: PlatformSkuMappings.CurrentSpecialPrice | nullable: yes
  lastPriceSyncAt?: string; // Source: PlatformSkuMappings.LastPriceSyncAt | nullable: yes
  lastSyncedAt: string; // Source: PlatformSkuMappings.LastSyncedAt | nullable: no
}
