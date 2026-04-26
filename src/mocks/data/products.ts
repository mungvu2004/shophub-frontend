import type { Product } from "@/types/product.types";
import type { PlatformCode } from "@/types/platform.types";

const platforms: PlatformCode[] = ["lazada", "shopee", "tiktok_shop"];

const categories = ["Áo thun", "Váy nữ", "Quần nam", "Áo sơ mi", "Áo khoác", "Quần tây", "Đồ thể thao"];

const productNames = [
  "Áo thun basic trắng",
  "Váy hoa nhí màu đỏ",
  "Quần jean slim fit xanh",
  "Áo sơ mi công sở nữ",
  "Áo khoác denim",
  "Váy công sở midi",
  "Quần tây nam màu đen",
  "Áo phông nam cotton",
  "Váy xòe cổ điển",
  "Áo cardigan len",
  "Quần short jean nữ",
  "Áo hoodie unisex",
  "Váy maxi đuôi cá",
  "Quần legging tập yoga",
  "Áo tank top nữ",
  "Áo hoodie ziper nam",
  "Váy babydoll yêu thích",
  "Quần chino nam thời trang",
  "Áo blazer nữ công sở",
  "Váy chữ A cổ điển",
];

const buildPlaceholderImage = (label: string, bgColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="${bgColor}"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const mockProducts: Product[] = Array.from({ length: 62 }, (_, idx) => {
  const n = idx + 1;
  const code = platforms[idx % platforms.length];
  const productName = productNames[idx % productNames.length];
  const status = n % 5 === 0 ? "Inactive" : (n % 13 === 0 ? "Deleted" : "Active");
  const category = categories[idx % categories.length];
  const mainImage = buildPlaceholderImage(`P${n}`, "#64748b");
  const altImage = buildPlaceholderImage(`P${n}-2`, "#94a3b8");
  const variantImage = buildPlaceholderImage(`P${n}V2`, "#475569");
  const variantAltImage = buildPlaceholderImage(`P${n}V2-2`, "#334155");

  const stock = (n * 7) % 180 + 20;
  const sold = (n * 11) % 280 + 40;
  const revenue = ((n * 13) % 120 + 20) * 1000000;
  const margin = (n * 17) % 40 + 15;
  const qualityScore = (n * 23) % 60 + 40;
  const trendData = Array.from({ length: 7 }).map((_, i) => ({
    value: (n * (i + 1) * 13) % 100 + 20
  }));

  return {
    id: `prod-${String(n).padStart(3, "0")}`,
    sellerId: "seller-001",
    name: `${productName} - SKU${String(n).padStart(3, "0")}`,
    description: `Description for ${productName}`,
    shortDescription: `Short ${productName}`,
    brand: category,
    model: `M-${n}`,
    warrantyInfo: "12 months",
    status: status as "Active" | "Inactive" | "Deleted",
    source: n % 2 === 0 ? "platform_sync" : "manual",
    isDeleted: false,
    createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T02:00:00Z`,
    updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:00:00Z`,
    stock,
    sold,
    revenue,
    margin,
    qualityScore,
    trendData,
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
        mainImageUrl: mainImage,
        imagesJson: [
          mainImage,
          altImage,
        ],
        status: "Active" as const,
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
            listingStatus: n % 6 === 0 ? ("inactive" as const) : ("active" as const),
            currentListedPrice: 99000 + n * 1000,
            currentSpecialPrice: 89000 + n * 900,
            lastPriceSyncAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:30:00Z`,
            lastSyncedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T10:00:00Z`,
          },
        ],
      },
      ...(n % 3 === 0
        ? [
            {
              id: `var-${String(n).padStart(3, "0")}-2`,
              productId: `prod-${String(n).padStart(3, "0")}`,
              internalSku: `SKU-${String(n).padStart(4, "0")}-2`,
              name: "Variant 2",
              attributesJson: { color: "White", size: "L" },
              basePrice: 110000 + n * 1000,
              salePrice: 100000 + n * 900,
              weight: 0.4,
              length: 20,
              width: 15,
              height: 4,
              packageContent: "1 item",
              mainImageUrl: variantImage,
              imagesJson: [
                variantImage,
                variantAltImage,
              ],
              status: "Active" as const,
              isDeleted: false,
              createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T02:00:00Z`,
              updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:00:00Z`,
              listings: [
                {
                  id: n + 1000,
                  variantId: `var-${String(n).padStart(3, "0")}-2`,
                  connectionId: `pc-${String((n % 4) + 1).padStart(3, "0")}`,
                  platform: code,
                  externalProductId: `ext-prod-${n}-2`,
                  externalSkuId: `ext-sku-${n}-2`,
                  externalShopSku: `shop-sku-${n}-2`,
                  externalSellerSku: `seller-sku-${n}-2`,
                  listingStatus: "active" as const,
                  currentListedPrice: 109000 + n * 1000,
                  currentSpecialPrice: 99000 + n * 900,
                  lastPriceSyncAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T09:30:00Z`,
                  lastSyncedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T10:00:00Z`,
                },
              ],
            },
          ]
        : []),
    ],
  };
});
