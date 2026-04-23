export type RevenueChartsPlatform = "all" | "shopee" | "lazada" | "tiktok_shop";
export type RevenueChartsRange = 7 | 30;

export type RevenueChartsDailyPoint = {
  date: string;
  shopee: number;
  lazada: number;
  tiktokShop: number;
  previousShopee: number;
  previousLazada: number;
  previousTiktokShop: number;
};

export type RevenueChartsHourlyPoint = {
  hour: number;
  revenue: number;
};

export type RevenueChartsCategoryPoint = {
  id: string;
  label: string;
  revenue: number;
};

export type RevenueChartsWeeklyPoint = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  shopee: number;
  lazada: number;
  tiktokShop: number;
  growthPercent: number;
};

export type DashboardRevenueChartsPayload = {
  updatedAt: string;
  platform: RevenueChartsPlatform;
  rangeDays: RevenueChartsRange;
  summary: {
    totalRevenue: number;
    totalRevenueDeltaPercent: number;
    averageRevenuePerDay: number;
    averageRevenueDeltaPercent: number;
    highestDayRevenue: number;
    highestDayDate: string;
    lowestDayRevenue: number;
    lowestDayDate: string;
  };
  monthlyGoal: {
    monthLabel: string;
    targetRevenue: number;
    achievedRevenue: number;
    progressPercent: number;
  };
  dailySeries: Array<{
    date: string;
    shopee: number;
    lazada: number;
    tiktokShop: number;
    previousTotal: number;
  }>;
  hourlyDistribution: RevenueChartsHourlyPoint[];
  categoryBreakdown: RevenueChartsCategoryPoint[];
  weeklyComparison: RevenueChartsWeeklyPoint[];
  peakHoursLabel: string;
};

const baseDate = new Date("2026-03-01T00:00:00Z");

const toDate = (offset: number) => {
  const date = new Date(baseDate);
  date.setUTCDate(baseDate.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

const dailyBase: RevenueChartsDailyPoint[] = Array.from(
  { length: 30 },
  (_, idx) => {
    const shopee = 31_500_000 + idx * 360_000 + (idx % 4) * 1_100_000;
    const lazada = 18_700_000 + idx * 285_000 + (idx % 5) * 860_000;
    const tiktokShop = 24_800_000 + idx * 320_000 + (idx % 3) * 940_000;

    const previousShopee = Math.round(shopee * (0.88 + (idx % 5) * 0.01));
    const previousLazada = Math.round(lazada * (0.84 + (idx % 7) * 0.012));
    const previousTiktokShop = Math.round(tiktokShop * (0.82 + (idx % 4) * 0.015));

    return {
      date: toDate(idx),
      shopee,
      lazada,
      tiktokShop,
      previousShopee,
      previousLazada,
      previousTiktokShop,
    };
  },
);

const hourlyPatternAll = [
  28, 24, 21, 18, 19, 23,
  34, 49, 62, 71, 78, 84,
  79, 83, 92, 104, 122, 146,
  168, 182, 196, 178, 116, 72,
];

const scaleHourlyPattern = (platform: RevenueChartsPlatform) => {
  const multiplier =
    platform === "shopee"
      ? 0.45
      : platform === "lazada"
        ? 0.28
        : platform === "tiktok_shop"
          ? 0.27
          : 1;

  return hourlyPatternAll.map((value, hour) => ({
    hour,
    revenue: Math.round(value * multiplier * 1_000_000),
  }));
};

const categoryBase = [
  { id: "ao-thun", label: "Áo thun", allRevenue: 420_000_000 },
  { id: "quan-vay", label: "Quần & Váy", allRevenue: 315_000_000 },
  { id: "phu-kien", label: "Phụ kiện", allRevenue: 180_000_000 },
  { id: "giay-dep", label: "Giày dép", allRevenue: 110_000_000 },
  { id: "khac", label: "Khác", allRevenue: 45_000_000 },
];

const weeklyBase: RevenueChartsWeeklyPoint[] = [
  {
    id: "w11",
    label: "Tuần 11",
    startDate: "2026-03-11",
    endDate: "2026-03-17",
    shopee: 210_500_000,
    lazada: 120_300_000,
    tiktokShop: 145_200_000,
    growthPercent: 18.2,
  },
  {
    id: "w10",
    label: "Tuần 10",
    startDate: "2026-03-04",
    endDate: "2026-03-10",
    shopee: 185_000_000,
    lazada: 101_400_000,
    tiktokShop: 115_800_000,
    growthPercent: 4.5,
  },
  {
    id: "w09",
    label: "Tuần 09",
    startDate: "2026-02-26",
    endDate: "2026-03-03",
    shopee: 178_400_000,
    lazada: 96_800_000,
    tiktokShop: 109_500_000,
    growthPercent: -2.1,
  },
  {
    id: "w08",
    label: "Tuần 08",
    startDate: "2026-02-19",
    endDate: "2026-02-25",
    shopee: 192_100_000,
    lazada: 99_300_000,
    tiktokShop: 101_800_000,
    growthPercent: 12.0,
  },
];

const toScopedRevenue = (point: RevenueChartsDailyPoint, platform: RevenueChartsPlatform) => {
  if (platform === "shopee") {
    return {
      date: point.date,
      shopee: point.shopee,
      lazada: 0,
      tiktokShop: 0,
      previousTotal: point.previousShopee,
    };
  }

  if (platform === "lazada") {
    return {
      date: point.date,
      shopee: 0,
      lazada: point.lazada,
      tiktokShop: 0,
      previousTotal: point.previousLazada,
    };
  }

  if (platform === "tiktok_shop") {
    return {
      date: point.date,
      shopee: 0,
      lazada: 0,
      tiktokShop: point.tiktokShop,
      previousTotal: point.previousTiktokShop,
    };
  }

  return {
    date: point.date,
    shopee: point.shopee,
    lazada: point.lazada,
    tiktokShop: point.tiktokShop,
    previousTotal: point.previousShopee + point.previousLazada + point.previousTiktokShop,
  };
};

const toCategoryBreakdown = (platform: RevenueChartsPlatform): RevenueChartsCategoryPoint[] => {
  const ratio =
    platform === "shopee"
      ? 0.48
      : platform === "lazada"
        ? 0.29
        : platform === "tiktok_shop"
          ? 0.26
          : 1;

  return categoryBase.map((item) => ({
    id: item.id,
    label: item.label,
    revenue: Math.round(item.allRevenue * ratio),
  }));
};

const toWeeklyComparison = (platform: RevenueChartsPlatform): RevenueChartsWeeklyPoint[] => {
  if (platform === "all") {
    return weeklyBase;
  }

  return weeklyBase.map((item) => {
    if (platform === "shopee") {
      return {
        ...item,
        lazada: 0,
        tiktokShop: 0,
      };
    }

    if (platform === "lazada") {
      return {
        ...item,
        shopee: 0,
        tiktokShop: 0,
      };
    }

    return {
      ...item,
      shopee: 0,
      lazada: 0,
    };
  });
};

const totalOfPoint = (item: { shopee: number; lazada: number; tiktokShop: number }) => item.shopee + item.lazada + item.tiktokShop;

const toSummary = (dailySeries: Array<{ shopee: number; lazada: number; tiktokShop: number; date: string; previousTotal: number }>) => {
  if (dailySeries.length === 0) {
    return {
      totalRevenue: 0,
      totalRevenueDeltaPercent: 0,
      averageRevenuePerDay: 0,
      averageRevenueDeltaPercent: 0,
      highestDayRevenue: 0,
      highestDayDate: "--",
      lowestDayRevenue: 0,
      lowestDayDate: "--",
    };
  }

  const totals = dailySeries.map((item) => ({
    date: item.date,
    total: totalOfPoint(item),
    previousTotal: item.previousTotal,
  }));

  const totalRevenue = totals.reduce((sum, item) => sum + item.total, 0);
  const previousRevenue = totals.reduce((sum, item) => sum + item.previousTotal, 0);

  const highest = totals.reduce((best, item) => (item.total > best.total ? item : best), totals[0]);
  const lowest = totals.reduce((best, item) => (item.total < best.total ? item : best), totals[0]);

  const averageRevenuePerDay = Math.round(totalRevenue / totals.length);
  const averagePreviousPerDay = Math.round(previousRevenue / totals.length);

  return {
    totalRevenue,
    totalRevenueDeltaPercent: previousRevenue > 0 ? Number((((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)) : 0,
    averageRevenuePerDay,
    averageRevenueDeltaPercent:
      averagePreviousPerDay > 0
        ? Number((((averageRevenuePerDay - averagePreviousPerDay) / averagePreviousPerDay) * 100).toFixed(1))
        : 0,
    highestDayRevenue: highest.total,
    highestDayDate: highest.date,
    lowestDayRevenue: lowest.total,
    lowestDayDate: lowest.date,
  };
};

export const getDashboardRevenueChartsPayload = (params: {
  platform: RevenueChartsPlatform;
  rangeDays: RevenueChartsRange;
}): DashboardRevenueChartsPayload => {
  const fullSeries = dailyBase.map((point) => toScopedRevenue(point, params.platform));
  const dailySeries = fullSeries.slice(-params.rangeDays);
  const summary = toSummary(dailySeries);

  const achievedRevenue = Math.round(summary.totalRevenue * 0.854);

  return {
    updatedAt: "14:35",
    platform: params.platform,
    rangeDays: params.rangeDays,
    summary,
    monthlyGoal: {
      monthLabel: "tháng 3",
      targetRevenue: summary.totalRevenue,
      achievedRevenue,
      progressPercent: summary.totalRevenue > 0 ? Number(((achievedRevenue / summary.totalRevenue) * 100).toFixed(1)) : 0,
    },
    dailySeries,
    hourlyDistribution: scaleHourlyPattern(params.platform),
    categoryBreakdown: toCategoryBreakdown(params.platform),
    weeklyComparison: toWeeklyComparison(params.platform),
    peakHoursLabel: "19h - 22h",
  };
};
