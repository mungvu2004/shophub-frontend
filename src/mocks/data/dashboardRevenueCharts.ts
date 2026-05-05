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
  products: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
};

export type RevenueTimelineEvent = {
  id: string;
  date: string;
  label: string;
  type: "flash_sale" | "holiday";
  impactPercent: number;
};

export type RevenueHourlyHeatmapPoint = {
  dayIndex: number;
  hour: number;
  orderCount: number;
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
    voucherRevenue: number;
    promotionRevenue: number;
  }>;
  hourlyDistribution: RevenueChartsHourlyPoint[];
  categoryBreakdown: RevenueChartsCategoryPoint[];
  weeklyComparison: RevenueChartsWeeklyPoint[];
  peakHoursLabel: string;
  timelineEvents: RevenueTimelineEvent[];
  hourlyHeatmap: RevenueHourlyHeatmapPoint[];
};

const baseDate = new Date("2026-04-05T00:00:00Z"); // Align with orders: April 5 - May 5, 2026

const toDate = (offset: number) => {
  const date = new Date(baseDate);
  date.setUTCDate(baseDate.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

/**
 * Daily revenue data aligned with mockOrders (50 orders / 30 days)
 * Total 30d revenue: ~8.7M VND
 * Daily average: 290k VND (Shopee 34%: 99k, Lazada 34%: 99k, TikTok 32%: 93k)
 * Platform split aligned with actual mockOrders distribution (17/17/16)
 */
const dailyBase: RevenueChartsDailyPoint[] = Array.from(
  { length: 30 },
  (_, idx) => {
    // Day of week weights: lower weekdays, higher on Friday-Sunday
    const dayOfWeek = new Date(baseDate.getTime() + idx * 86400000).getUTCDay();
    const dayWeight = dayOfWeek === 5 ? 1.4 : dayOfWeek === 6 ? 1.35 : dayOfWeek === 0 ? 1.3 : 0.9;
    const volatility = 1 + ((idx + 1) * 0.05) % 0.2 - 0.1;

    // baseDaily calibrated so sum ≈ 8,700,000 over 30 days
    const baseDaily = 272_000;
    const adjustedDaily = Math.round(baseDaily * dayWeight * volatility);

    // Platform split aligned with mockOrders (lazada=17, shopee=17, tiktok_shop=16)
    const shopee = Math.round(adjustedDaily * 0.34);
    const lazada = Math.round(adjustedDaily * 0.34);
    const tiktokShop = Math.round(adjustedDaily * 0.32);

    const previousShopee = Math.round(shopee * (0.85 + (idx % 5) * 0.03));
    const previousLazada = Math.round(lazada * (0.80 + (idx % 5) * 0.04));
    const previousTiktokShop = Math.round(tiktokShop * (0.82 + (idx % 5) * 0.03));

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
  2, 2, 1, 1, 1, 2,
  3, 5, 7, 8, 9, 10,
  9, 10, 11, 12, 14, 17,
  19, 21, 23, 20, 13, 8,
];

const scaleHourlyPattern = (platform: RevenueChartsPlatform) => {
  const multiplier =
    platform === "shopee"
      ? 0.40
      : platform === "lazada"
        ? 0.30
        : platform === "tiktok_shop"
          ? 0.30
          : 1;

  return hourlyPatternAll.map((value, hour) => ({
    hour,
    revenue: Math.round(value * multiplier * 4_500), // Total daily ~290k
  }));
};

/**
 * Category breakdown scaled for 8.7M total revenue
 * Aligned with actual product catalog categories from products.ts
 * Áo thun (35%), Váy nữ (25%), Quần nam (20%), Áo sơ mi & khoác (15%), Khác (5%)
 */
const categoryBase = [
  {
    id: "ao-thun",
    label: "Áo thun",
    allRevenue: 3_045_000, // 35% of 8.7M
    products: [
      { id: "prod-001", name: "Áo thun basic trắng", revenue: 1_200_000, orders: 14 },
      { id: "prod-021", name: "Áo thun basic trắng (v2)", revenue: 1_015_000, orders: 11 },
      { id: "prod-041", name: "Áo thun basic trắng (v3)", revenue: 830_000, orders: 9 },
    ],
  },
  {
    id: "vay-nu",
    label: "Váy nữ",
    allRevenue: 2_175_000, // 25% of 8.7M
    products: [
      { id: "prod-006", name: "Váy công sở midi", revenue: 750_000, orders: 8 },
      { id: "prod-002", name: "Váy hoa nhí màu đỏ", revenue: 850_000, orders: 9 },
      { id: "prod-009", name: "Váy xòe cổ điển", revenue: 575_000, orders: 6 },
    ],
  },
  {
    id: "quan-nam",
    label: "Quần nam",
    allRevenue: 1_740_000, // 20% of 8.7M
    products: [
      { id: "prod-003", name: "Quần jean slim fit xanh", revenue: 950_000, orders: 10 },
      { id: "prod-007", name: "Quần tây nam màu đen", revenue: 620_000, orders: 7 },
      { id: "prod-011", name: "Quần short jean nữ", revenue: 170_000, orders: 2 },
    ],
  },
  {
    id: "ao-so-mi-khoac",
    label: "Áo sơ mi & khoác",
    allRevenue: 1_305_000, // 15% of 8.7M
    products: [
      { id: "prod-004", name: "Áo sơ mi công sở nữ", revenue: 850_000, orders: 9 },
      { id: "prod-005", name: "Áo khoác denim", revenue: 680_000, orders: 7 },
      { id: "prod-012", name: "Áo hoodie unisex", revenue: 330_000, orders: 4 }, // Note: padded to keep sum
    ],
  },
  {
    id: "khac",
    label: "Khác",
    allRevenue: 435_000, // 5% of 8.7M
    products: [
      { id: "prod-008", name: "Áo phông nam cotton", revenue: 580_000, orders: 6 },
      { id: "prod-010", name: "Áo cardigan len", revenue: 490_000, orders: 5 },
      { id: "prod-014", name: "Quần legging tập yoga", revenue: 335_000, orders: 4 },
    ],
  },
];

let timelineEventsBase: RevenueTimelineEvent[] = [
  {
    id: "flash-0405",
    date: "2026-04-15",
    label: "Flash Sale 15/4",
    type: "flash_sale",
    impactPercent: 15.2,
  },
  {
    id: "holiday-0430",
    date: "2026-04-30",
    label: "Lễ 30/4",
    type: "holiday",
    impactPercent: 12.3,
  },
];

export const getTimelineEvents = () => timelineEventsBase;

export const createTimelineEvent = (payload: Omit<RevenueTimelineEvent, "id">) => {
  const newEvent: RevenueTimelineEvent = {
    ...payload,
    id: `event-${Date.now()}`,
  };
  timelineEventsBase = [newEvent, ...timelineEventsBase];
  return newEvent;
};

export const updateTimelineEvent = (id: string, payload: Partial<RevenueTimelineEvent>) => {
  const index = timelineEventsBase.findIndex((e) => e.id === id);
  if (index === -1) return null;

  timelineEventsBase[index] = { ...timelineEventsBase[index], ...payload };
  return timelineEventsBase[index];
};

export const deleteTimelineEvent = (id: string) => {
  const index = timelineEventsBase.findIndex((e) => e.id === id);
  if (index === -1) return false;

  timelineEventsBase = timelineEventsBase.filter((e) => e.id !== id);
  return true;
};

const weeklyBase: RevenueChartsWeeklyPoint[] = [
  {
    id: "w18",
    label: "Tuần 18",
    startDate: "2026-04-29",
    endDate: "2026-05-05",
    shopee: 740_000,
    lazada: 740_000,
    tiktokShop: 695_000,
    growthPercent: 8.2,
  },
  {
    id: "w17",
    label: "Tuần 17",
    startDate: "2026-04-22",
    endDate: "2026-04-28",
    shopee: 680_000,
    lazada: 680_000,
    tiktokShop: 640_000,
    growthPercent: 3.5,
  },
  {
    id: "w16",
    label: "Tuần 16",
    startDate: "2026-04-15",
    endDate: "2026-04-21",
    shopee: 820_000,
    lazada: 820_000,
    tiktokShop: 770_000,
    growthPercent: 12.1,
  },
  {
    id: "w15",
    label: "Tuần 15",
    startDate: "2026-04-08",
    endDate: "2026-04-14",
    shopee: 640_000,
    lazada: 640_000,
    tiktokShop: 600_000,
    growthPercent: -1.2,
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
    products: item.products.map((product) => ({
      ...product,
      revenue: Math.round(product.revenue * ratio),
      orders: Math.max(1, Math.round(product.orders * ratio)),
    })),
  }));
};

const toVoucherPromotion = (
  point: { shopee: number; lazada: number; tiktokShop: number },
  dateIndex: number,
  platform: RevenueChartsPlatform,
) => {
  const total = point.shopee + point.lazada + point.tiktokShop;
  const promoBase = 0.09 + (dateIndex % 4) * 0.008;
  const voucherBase = 0.06 + (dateIndex % 3) * 0.006;

  const scopeFactor =
    platform === "all"
      ? 1
      : platform === "shopee"
        ? 0.88
        : platform === "lazada"
          ? 0.84
          : 0.82;

  return {
    voucherRevenue: Math.round(total * voucherBase * scopeFactor),
    promotionRevenue: Math.round(total * promoBase * scopeFactor),
  };
};

const dayWeights = [0.82, 0.9, 0.96, 1.02, 1.08, 1.24, 1.16];

const toHourlyHeatmap = (platform: RevenueChartsPlatform): RevenueHourlyHeatmapPoint[] => {
  const platformFactor =
    platform === "all"
      ? 1
      : platform === "shopee"
        ? 0.46
        : platform === "lazada"
          ? 0.31
          : 0.28;

  return Array.from({ length: 7 }, (_, dayIndex) =>
    Array.from({ length: 24 }, (_, hour) => {
      const base = hourlyPatternAll[hour] * dayWeights[dayIndex] * platformFactor;
      const variance = ((dayIndex + 1) * (hour + 3)) % 9;

      return {
        dayIndex,
        hour,
        orderCount: Math.max(2, Math.round(base * 1.75 + variance * 2)),
      };
    }),
  ).flat();
};

const toTimelineEvents = (rangeDays: RevenueChartsRange): RevenueTimelineEvent[] => {
  const visibleStartOffset = 30 - rangeDays;
  const visibleStartDate = toDate(visibleStartOffset);

  return timelineEventsBase.filter((event) => event.date >= visibleStartDate);
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
  const fullSeries = dailyBase.map((point, index) => {
    const scoped = toScopedRevenue(point, params.platform);
    const overlays = toVoucherPromotion(scoped, index, params.platform);

    return {
      ...scoped,
      ...overlays,
    };
  });
  const dailySeries = fullSeries.slice(-params.rangeDays);
  const summary = toSummary(dailySeries);

  // achievedRevenue = actual total revenue earned this month so far
  const achievedRevenue = summary.totalRevenue;

  return {
    updatedAt: "14:35",
    platform: params.platform,
    rangeDays: params.rangeDays,
    summary,
    monthlyGoal: {
      monthLabel: "tháng 5/2026",
      targetRevenue: 12_000_000,
      achievedRevenue,
      progressPercent: achievedRevenue > 0 ? Number(((achievedRevenue / 12_000_000) * 100).toFixed(1)) : 0,
    },
    dailySeries,
    hourlyDistribution: scaleHourlyPattern(params.platform),
    categoryBreakdown: toCategoryBreakdown(params.platform),
    weeklyComparison: toWeeklyComparison(params.platform),
    peakHoursLabel: "19h - 22h",
    timelineEvents: toTimelineEvents(params.rangeDays),
    hourlyHeatmap: toHourlyHeatmap(params.platform),
  };
};
