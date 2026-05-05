export type DashboardPlatformCode = "lazada" | "shopee" | "tiktok_shop";

export type DashboardRevenuePoint = {
  date: string;
  lazada: number;
  shopee: number;
  tiktok: number;
  total: number;
};

export type DashboardKPIOverview = {
  totalRevenue30d: number;
  totalOrders30d: number;
  averageOrderValue: number;
  conversionRate: number;
  refundRate: number;
  newCustomers30d: number;
};

export type DashboardRevenueByPlatform = {
  platform: DashboardPlatformCode;
  revenue: number;
  orders: number;
};

const baseDate = new Date("2026-04-05T00:00:00Z"); // Align with orders (past 30 days from May 5, 2026)

/**
 * Revenue data aligned with actual orders data
 * Calculated from mockOrders: 50 orders spread over 30 days
 * Platform distribution: 34% Lazada, 34% Shopee, 32% TikTok (actual mockOrders: 17/17/16)
 * Average order value: ~174,000 VND
 */
export const dashboardRevenue30d: DashboardRevenuePoint[] = Array.from(
  { length: 30 },
  (_, idx) => {
    const currentDate = new Date(baseDate);
    currentDate.setUTCDate(baseDate.getUTCDate() + idx);

    // Daily average: 8.7M total / 30 = 290k/day
    // Platform split: Lazada 34% (99k), Shopee 34% (99k), TikTok 32% (93k)
    // Variance based on day of week (higher weekends)
    const dayOfWeek = currentDate.getUTCDay();
    const weekendMultiplier = (dayOfWeek === 5 || dayOfWeek === 6) ? 1.3 : (dayOfWeek === 0 ? 1.2 : 0.95);
    const volatility = 1 + (idx % 5) * 0.08 - 0.16;

    // baseDaily calibrated so sum ≈ 8,700,000 over 30 days
    const baseDaily = 268_000;
    const adjDaily = Math.round(baseDaily * weekendMultiplier * volatility);

    // Platform split aligned with actual mockOrders (lazada=17, shopee=17, tiktok=16)
    const lazada = Math.round(adjDaily * 0.34);
    const shopee = Math.round(adjDaily * 0.34);
    const tiktok = Math.round(adjDaily * 0.32);
    const total = lazada + shopee + tiktok;

    return {
      date: currentDate.toISOString().slice(0, 10),
      lazada,
      shopee,
      tiktok,
      total,
    };
  },
);

const revenueSums = dashboardRevenue30d.reduce(
  (acc, point) => {
    acc.lazada += point.lazada;
    acc.shopee += point.shopee;
    acc.tiktok += point.tiktok;
    acc.total += point.total;
    return acc;
  },
  { lazada: 0, shopee: 0, tiktok: 0, total: 0 },
);

// Orders aligned with actual mockOrders distribution (platforms[(n-1)%3] => lazada=17, shopee=17, tiktok_shop=16)
export const dashboardRevenueByPlatform: DashboardRevenueByPlatform[] = [
  {
    platform: "lazada",
    revenue: revenueSums.lazada,
    orders: 17, // actual: n=1,4,7,...49 → 17 lazada orders
  },
  {
    platform: "shopee",
    revenue: revenueSums.shopee,
    orders: 17, // actual: n=2,5,8,...50 → 17 shopee orders
  },
  {
    platform: "tiktok_shop",
    revenue: revenueSums.tiktok,
    orders: 16, // actual: n=3,6,9,...48 → 16 tiktok_shop orders
  },
];

const totalOrders30d = dashboardRevenueByPlatform.reduce(
  (acc, platform) => acc + platform.orders,
  0,
);

export const dashboardKPIOverview: DashboardKPIOverview = {
  totalRevenue30d: revenueSums.total,
  totalOrders30d,
  averageOrderValue: Math.round(revenueSums.total / totalOrders30d),
  conversionRate: 2.5, // Realistic for multi-platform e-commerce
  refundRate: 2.8, // tỷ lệ hoàn/huỷ ~2.8% (1–2 đơn trong 50 đơn 30 ngày)
  newCustomers30d: 8, // 8 buyer profiles duy nhất trong mockOrders
};
