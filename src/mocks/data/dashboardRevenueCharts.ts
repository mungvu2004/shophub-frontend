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
  {
    id: "ao-thun",
    label: "Áo thun",
    allRevenue: 420_000_000,
    products: [
      { id: "tee-oversize", name: "Áo thun Oversize Fit", revenue: 138_000_000, orders: 1210 },
      { id: "tee-basic", name: "Áo thun Basic Cotton", revenue: 112_000_000, orders: 980 },
      { id: "tee-premium", name: "Áo thun Premium CoolTouch", revenue: 84_000_000, orders: 560 },
    ],
  },
  {
    id: "quan-vay",
    label: "Quần & Váy",
    allRevenue: 315_000_000,
    products: [
      { id: "jeans-wide", name: "Quần jeans ống rộng", revenue: 96_000_000, orders: 640 },
      { id: "skirt-midi", name: "Chân váy midi xếp ly", revenue: 74_000_000, orders: 510 },
      { id: "pants-linen", name: "Quần linen công sở", revenue: 68_000_000, orders: 450 },
    ],
  },
  {
    id: "phu-kien",
    label: "Phụ kiện",
    allRevenue: 180_000_000,
    products: [
      { id: "belt-leather", name: "Thắt lưng da thật", revenue: 58_000_000, orders: 760 },
      { id: "bag-mini", name: "Túi đeo chéo mini", revenue: 54_000_000, orders: 430 },
      { id: "cap-sport", name: "Nón lưỡi trai sport", revenue: 32_000_000, orders: 620 },
    ],
  },
  {
    id: "giay-dep",
    label: "Giày dép",
    allRevenue: 110_000_000,
    products: [
      { id: "sneaker-lite", name: "Sneaker Lite Daily", revenue: 44_000_000, orders: 280 },
      { id: "sandal-soft", name: "Sandal Soft Walk", revenue: 31_000_000, orders: 300 },
      { id: "loafer-form", name: "Giày lười Form 2.0", revenue: 22_000_000, orders: 170 },
    ],
  },
  {
    id: "khac",
    label: "Khác",
    allRevenue: 45_000_000,
    products: [
      { id: "sock-pack", name: "Set vớ 5 đôi", revenue: 15_000_000, orders: 410 },
      { id: "care-kit", name: "Bộ chăm sóc quần áo", revenue: 11_000_000, orders: 170 },
      { id: "gift-box", name: "Hộp quà premium", revenue: 8_000_000, orders: 120 },
    ],
  },
];

let timelineEventsBase: RevenueTimelineEvent[] = [
  {
    id: "flash-1503",
    date: "2026-03-15",
    label: "Flash Sale 3.15",
    type: "flash_sale",
    impactPercent: 26.4,
  },
  {
    id: "holiday-0803",
    date: "2026-03-08",
    label: "Lễ 8/3",
    type: "holiday",
    impactPercent: 18.1,
  },
  {
    id: "flash-2503",
    date: "2026-03-25",
    label: "Mega Flash Night",
    type: "flash_sale",
    impactPercent: 31.7,
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
    timelineEvents: toTimelineEvents(params.rangeDays),
    hourlyHeatmap: toHourlyHeatmap(params.platform),
  };
};
