export type DashboardPlatformCode = "lazada" | "shopee" | "tiktok";

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

const baseDate = new Date("2026-03-01T00:00:00Z");

export const dashboardRevenue30d: DashboardRevenuePoint[] = Array.from(
  { length: 30 },
  (_, idx) => {
    const currentDate = new Date(baseDate);
    currentDate.setUTCDate(baseDate.getUTCDate() + idx);

    const lazada = 3_200_000 + idx * 145_000 + (idx % 4) * 85_000;
    const shopee = 3_900_000 + idx * 162_000 + (idx % 3) * 110_000;
    const tiktok = 2_450_000 + idx * 128_000 + (idx % 5) * 72_000;
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

export const dashboardRevenueByPlatform: DashboardRevenueByPlatform[] = [
  {
    platform: "lazada",
    revenue: revenueSums.lazada,
    orders: 1_180,
  },
  {
    platform: "shopee",
    revenue: revenueSums.shopee,
    orders: 1_340,
  },
  {
    platform: "tiktok",
    revenue: revenueSums.tiktok,
    orders: 980,
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
  conversionRate: 3.8,
  refundRate: 1.2,
  newCustomers30d: 846,
};
