import type { Product } from "@/types/product.types";
import type { PlatformCode } from "@/types/platform.types";

const platforms: PlatformCode[] = ["lazada", "shopee", "tiktok_shop"];

export const mockProducts: Product[] = Array.from({ length: 12 }, (_, idx) => {
  const n = idx + 1;
  const code = platforms[idx % platforms.length];

  return {
    id: `prod-${String(n).padStart(3, "0")}`,
    sellerId: "seller-001",
    name: `Demo Product ${n}`,
    description: `Description for demo product ${n}`,
    shortDescription: `Short demo ${n}`,
    brand: "ShopHub",
    model: `M-${n}`,
    warrantyInfo: "12 months",
    status: n % 5 === 0 ? "Inactive" : "Active",
    source: n % 2 === 0 ? "platform_sync" : "manual",
    isDeleted: false,
    createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T02:00:00Z`,
    updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:00:00Z`,
    variants: [
      {
        id: `var-${String(n).padStart(3, "0")}-1`,
        productId: `prod-${String(n).padStart(3, "0")}`,
        internalSku: `SKU-${String(n).padStart(4, "0")}`,
        name: "Default",
        attributesJson: { color: "Black", size: "M" },
        basePrice: 100000 + n * 1000,
        salePrice: 90000 + n * 900,
        weight: 0.4,
        length: 20,
        width: 15,
        height: 4,
        packageContent: "1 item",
        mainImageUrl: "https://via.placeholder.com/120",
        imagesJson: ["https://via.placeholder.com/120", "https://via.placeholder.com/121"],
        status: "Active",
        isDeleted: false,
        createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T02:00:00Z`,
        updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:00:00Z`,
        listings: [
          {
            id: n,
            variantId: `var-${String(n).padStart(3, "0")}-1`,
            connectionId: `pc-${String((n % 4) + 1).padStart(3, "0")}`,
            platform: code,
            externalProductId: `ext-prod-${n}`,
            externalSkuId: `ext-sku-${n}`,
            externalShopSku: `shop-sku-${n}`,
            externalSellerSku: `seller-sku-${n}`,
            listingStatus: n % 6 === 0 ? "inactive" : "active",
            currentListedPrice: 99000 + n * 1000,
            currentSpecialPrice: 89000 + n * 900,
            lastPriceSyncAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:30:00Z`,
            lastSyncedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T10:00:00Z`,
          },
        ],
      },
    ],
  };
});
