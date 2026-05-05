import type { Product } from "@/types/product.types";
import type { PlatformCode } from "@/types/platform.types";

const platforms: PlatformCode[] = ["lazada", "shopee", "tiktok_shop"];

const categories = [
  { id: "cat-001", name: "Áo thun" },
  { id: "cat-002", name: "Váy nữ" },
  { id: "cat-003", name: "Quần nam" },
  { id: "cat-004", name: "Áo sơ mi" },
  { id: "cat-005", name: "Áo khoác" },
  { id: "cat-006", name: "Quần tây" },
  { id: "cat-007", name: "Đồ thể thao" },
];

const suppliers = [
  { id: "sup-001", name: "Textile Vietnam Ltd", country: "VN" },
  { id: "sup-002", name: "Fashion Import Group", country: "VN" },
  { id: "sup-003", name: "Premium Garment Co", country: "VN" },
  { id: "sup-004", name: "Hanoi Clothing Factory", country: "VN" },
  { id: "sup-005", name: "SaiGon Fashion Supply", country: "VN" },
];

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

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const colorOptions = ["Black", "White", "Navy", "Red", "Gray", "Beige", "Blue", "Green"];

const buildPlaceholderImage = (label: string, bgColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="${bgColor}"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// Using Pexels CDN with real fashion photography (no API key required for direct URLs)
// Format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy
const categoryImageBank: Record<string, string[]> = {
  "cat-001": [ // Áo thun / T-shirts
    "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-002": [ // Váy nữ / Women's dresses
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-003": [ // Quần nam / Men's pants
    "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1861779/pexels-photo-1861779.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-004": [ // Áo sơ mi / Shirts
    "https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3649543/pexels-photo-3649543.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-005": [ // Áo khoác / Jackets
    "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3622609/pexels-photo-3622609.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-006": [ // Quần tây / Formal pants
    "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/2220317/pexels-photo-2220317.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
  "cat-007": [ // Đồ thể thao / Sportswear
    "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
    "https://images.pexels.com/photos/3621163/pexels-photo-3621163.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&fit=crop&crop=entropy",
  ],
};

const getCategoryImage = (categoryId: string, seed: number): string => {
  const imgs = categoryImageBank[categoryId];
  if (imgs && imgs.length > 0) return imgs[seed % imgs.length];
  return buildPlaceholderImage(`P${seed}`, "#64748b");
};

export const mockProducts: (Product & { 
  categoryId?: string; 
  supplierId?: string; 
  costPrice?: number; 
})[] = Array.from({ length: 62 }, (_, idx) => {
  const n = idx + 1;
  const code = platforms[idx % platforms.length];
  const productName = productNames[idx % productNames.length];
  const status = n % 5 === 0 ? "Inactive" : (n % 13 === 0 ? "Deleted" : "Active");
  const categoryIdx = idx % categories.length;
  const category = categories[categoryIdx];
  const supplier = suppliers[idx % suppliers.length];
  
  const mainImage     = getCategoryImage(category.id, n);
  const altImage       = getCategoryImage(category.id, n + 1);
  const variantImage   = getCategoryImage(category.id, n + 2);
  const variantAltImage = getCategoryImage(category.id, n + 3);

  const stock = (n * 7) % 180 + 20;
  const sold = (n * 11) % 280 + 40;
  const revenue = ((n * 13) % 120 + 20) * 1000000;
  const margin = (n * 17) % 40 + 15;
  const qualityScore = (n * 23) % 60 + 40;
  const trendData = Array.from({ length: 7 }).map((_, i) => ({
    value: (n * (i + 1) * 13) % 100 + 20
  }));

  // Generate realistic pricing: costPrice → basePrice → salePrice
  const baseCostPrice = 30000 + n * 2000; // Cost price in VND
  const basePrice = Math.round(baseCostPrice * 3.5); // 3.5x markup
  const salePrice = Math.round(basePrice * 0.9); // 10% discount

  return {
    id: `prod-${String(n).padStart(3, "0")}`,
    sellerId: "seller-001",
    categoryId: category.id,
    supplierId: supplier.id,
    name: `${productName} - SKU${String(n).padStart(3, "0")}`,
    description: `${productName} cao cấp. Chất liệu ${n % 2 === 0 ? "cotton" : "polyester"}. Phù hợp cho tất cả mùa. Bảo hành 12 tháng.`,
    shortDescription: `${productName}`,
    brand: category.name,
    model: `M-${n}`,
    warrantyInfo: "12 months",
    status: status as "Active" | "Inactive" | "Deleted",
    source: n % 2 === 0 ? "platform_sync" : "manual",
    isDeleted: false,
    createdAt: '2026-05-05T02:00:00Z',
    updatedAt: '2026-05-05T09:00:00Z',
    costPrice: baseCostPrice,
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
        internalSku: `SKU-${String(n).padStart(3, "0")}`,
        name: "Default",
        attributesJson: { 
          color: colorOptions[n % colorOptions.length], 
          size: sizeOptions[n % sizeOptions.length] 
        },
        basePrice,
        salePrice,
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
        createdAt: '2026-05-05T02:00:00Z',
        updatedAt: '2026-05-05T09:00:00Z',
        listings: [
          {
            id: n,
            variantId: `var-${String(n).padStart(3, "0")}-1`,
            connectionId: `pc-${String((n % 3) + 1).padStart(3, "0")}`,
            platform: code,
            externalProductId: `ext-prod-${n}`,
            externalSkuId: `ext-sku-${n}`,
            externalShopSku: `shop-sku-${n}`,
            externalSellerSku: `seller-sku-${n}`,
            listingStatus: n % 6 === 0 ? ("inactive" as const) : ("active" as const),
            currentListedPrice: salePrice,
            currentSpecialPrice: Math.round(salePrice * 0.95),
            lastPriceSyncAt: '2026-05-05T09:30:00Z',
            lastSyncedAt: '2026-05-05T10:00:00Z',
          },
        ],
      },
      ...(n % 3 === 0
        ? [
            {
              id: `var-${String(n).padStart(3, "0")}-2`,
              productId: `prod-${String(n).padStart(3, "0")}`,
              internalSku: `SKU-${String(n).padStart(3, "0")}-2`,
              name: "Variant 2",
              attributesJson: { 
                color: colorOptions[(n + 1) % colorOptions.length], 
                size: sizeOptions[(n + 1) % sizeOptions.length] 
              },
              basePrice: basePrice + 10000,
              salePrice: salePrice + 10000,
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
              createdAt: '2026-05-05T02:00:00Z',
              updatedAt: '2026-05-05T09:00:00Z',
              listings: [
                {
                  id: n + 1000,
                  variantId: `var-${String(n).padStart(3, "0")}-2`,
                  connectionId: `pc-${String((n % 3) + 1).padStart(3, "0")}`,
                  platform: code,
                  externalProductId: `ext-prod-${n}-2`,
                  externalSkuId: `ext-sku-${n}-2`,
                  externalShopSku: `shop-sku-${n}-2`,
                  externalSellerSku: `seller-sku-${n}-2`,
                  listingStatus: "active" as const,
                  currentListedPrice: salePrice + 10000,
                  currentSpecialPrice: Math.round((salePrice + 10000) * 0.95),
                  lastPriceSyncAt: '2026-05-05T09:30:00Z',
                  lastSyncedAt: '2026-05-05T10:00:00Z',
                },
              ],
            },
          ]
        : []),
    ],
  };
});
