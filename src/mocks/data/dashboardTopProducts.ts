import { mockOrders } from "@/mocks/data/orders";
import type { Order } from "@/types/order.types";
import type { PlatformCode } from "@/types/platform.types";

export type DashboardTopProductsMetric = "revenue" | "quantity" | "returnRate";
export type DashboardTopProductsRange = 7 | 30 | 90;
export type DashboardTopProductsPlatform = "all" | PlatformCode;

export type DashboardTopProductRecord = {
  id: string;
  name: string;
  sku: string;
  platform: PlatformCode;
  imageUrl: string;
  soldQty: number;
  revenue: number;
  avgPrice: number;
  returnRate: number;
  trendPercent: number;
};

export type DashboardTopProductsPayload = {
  updatedAt: string;
  metric: DashboardTopProductsMetric;
  rangeDays: DashboardTopProductsRange;
  platform: DashboardTopProductsPlatform;
  podium: DashboardTopProductRecord[];
  ranking: DashboardTopProductRecord[];
  insights: Array<{
    id: string;
    title: string;
    description: string;
    tone: "info" | "warning" | "positive";
  }>;
  contribution: Array<{
    id: string;
    label: string;
    percent: number;
  }>;
  declining: DashboardTopProductRecord[];
};

const toPlatform = (platform: Order["platform"]): PlatformCode => {
  if (platform === "tiktok_shop") {
    return "tiktok_shop";
  }

  if (platform === "lazada") {
    return "lazada";
  }

  return "shopee";
};

const productPalette = ["#1e293b", "#0f766e", "#7c2d12", "#1d4ed8", "#7c3aed", "#be123c"];

const buildProductImage = (name: string, seed: number) => {
  const baseColor = productPalette[seed % productPalette.length];
  const text = name
    .split(" ")
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${baseColor}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><rect rx="18" width="128" height="128" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#f8fafc" font-family="JetBrains Mono, monospace" font-weight="700" font-size="28">${text}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const toMetricValue = (item: DashboardTopProductRecord, metric: DashboardTopProductsMetric) => {
  if (metric === "quantity") {
    return item.soldQty;
  }

  if (metric === "returnRate") {
    return item.returnRate;
  }

  return item.revenue;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const buildAggregatedProducts = () => {
  const aggregate = new Map<string, DashboardTopProductRecord>();

  mockOrders.forEach((order, orderIndex) => {
    const platform = toPlatform(order.platform);
    const items = Array.isArray(order.items) ? order.items : [];

    items.forEach((item, itemIndex) => {
      const name = item.productName?.trim() || `Sản phẩm ${order.id}`;
      const key = `${name.toLowerCase()}-${platform}`;
      const qty = Number.isFinite(item.qty) && item.qty > 0 ? item.qty : 1;
      const unitPrice = Number.isFinite(item.paidPrice) && item.paidPrice > 0 ? item.paidPrice : item.itemPrice;
      const revenue = Math.max(0, unitPrice * qty);
      const seed = orderIndex + itemIndex + 1;

      const current =
        aggregate.get(key)
        || {
          id: key,
          name,
          sku: (item.externalSkuRef || `SKU-${String(seed).padStart(4, "0")}`).toUpperCase(),
          platform,
          imageUrl: buildProductImage(name, seed),
          soldQty: 0,
          revenue: 0,
          avgPrice: 0,
          returnRate: 0,
          trendPercent: 0,
        };

      current.soldQty += qty;
      current.revenue += revenue;
      current.avgPrice = current.soldQty > 0 ? current.revenue / current.soldQty : 0;

      const statusWeight = order.status === "Cancelled" || order.status === "Returned" || order.status === "Refunded" ? 1.8 : 0.35;
      current.returnRate += statusWeight * 0.42;

      aggregate.set(key, current);
    });
  });

  const allRows = Array.from(aggregate.values());

  return allRows.map((row, index) => {
    const baseline = ((index % 5) - 1.5) * 1.3;
    const volumeBoost = row.soldQty > 1 ? Math.log2(row.soldQty + 1) * 2.4 : 0.2;

    return {
      ...row,
      returnRate: Number(clamp(row.returnRate, 0.2, 8.6).toFixed(1)),
      trendPercent: Number((baseline + volumeBoost).toFixed(1)),
    };
  });
};

const applyRangeFactor = (rows: DashboardTopProductRecord[], rangeDays: DashboardTopProductsRange) => {
  const factor = rangeDays === 7 ? 0.38 : rangeDays === 90 ? 1.45 : 1;

  return rows.map((row, index) => {
    const rangeShift = ((index % 4) - 1.5) * (rangeDays === 7 ? 0.8 : rangeDays === 90 ? 1.6 : 1.1);

    return {
      ...row,
      soldQty: Math.max(1, Math.round(row.soldQty * factor)),
      revenue: Math.round(row.revenue * factor),
      avgPrice: row.avgPrice,
      returnRate: Number(clamp(row.returnRate + rangeShift, 0.1, 12).toFixed(1)),
      trendPercent: Number((row.trendPercent + rangeShift).toFixed(1)),
    };
  });
};

const withMetricOrder = (rows: DashboardTopProductRecord[], metric: DashboardTopProductsMetric) => {
  const sorted = [...rows].sort((a, b) => toMetricValue(b, metric) - toMetricValue(a, metric));

  return sorted.map((item, index) => {
    // Giả lập thay đổi thứ hạng: hạng cao thường ổn định, hạng thấp biến động
    const rankChange = index < 3 ? 0 : (index % 5) - 2;
    
    // Giả lập dữ liệu bán hàng 7 ngày (Sparkline)
    const baseVal = metric === 'quantity' ? item.soldQty / 10 : item.revenue / 1000000;
    const last7DaysSales = Array.from({ length: 7 }, (_, i) => {
      const volatility = 1 + (Math.sin(i + index) * 0.3);
      return Math.round(baseVal * volatility);
    });

    return {
      ...item,
      rankChange,
      last7DaysSales,
      trendPercent:
        metric === "returnRate"
          ? Number((item.trendPercent * -1).toFixed(1))
          : Number((item.trendPercent + (3 - (index % 6))).toFixed(1)),
    };
  });
};

const buildInsights = (ranking: DashboardTopProductRecord[], metric: DashboardTopProductsMetric) => {
  const leader = ranking[0];
  const lowPerformer = ranking[ranking.length - 1];
  const tiktokCandidate = ranking.find((item) => item.platform === "tiktok_shop") ?? ranking[1];

  return [
    {
      id: "insight-leader",
      title: `${leader?.name ?? "Sản phẩm top"} dẫn đầu`,
      description:
        metric === "quantity"
          ? `Giữ nhịp bán đều với ${leader?.soldQty ?? 0} sản phẩm, nên ưu tiên ngân sách ads chuyển đổi.`
          : `Doanh thu nổi bật ${(leader?.revenue ?? 0).toLocaleString("vi-VN")} ₫, tiếp tục đẩy combo upsell cùng SKU liên quan.`,
      tone: "positive" as const,
    },
    {
      id: "insight-tiktok",
      title: "TikTok Shop cần tối ưu tồn kho",
      description: `${tiktokCandidate?.name ?? "SKU TikTok"} có biên độ nhu cầu cao, nên chuẩn bị thêm 120-200 units trước đợt flash sale.`,
      tone: "info" as const,
    },
    {
      id: "insight-risk",
      title: `${lowPerformer?.name ?? "Sản phẩm đuối"} đang giảm hiệu suất`,
      description: "Ưu tiên kiểm tra creative, giá niêm yết và phản hồi chat để giảm tỷ lệ hoàn trong 7 ngày tới.",
      tone: "warning" as const,
    },
  ];
};

const buildContribution = (ranking: DashboardTopProductRecord[]) => {
  const totalRevenue = ranking.reduce((sum, item) => sum + item.revenue, 0);
  const group = {
    tops: 0,
    dresses: 0,
    shoes: 0,
    others: 0,
  };

  ranking.slice(0, 20).forEach((item) => {
    const normalizedName = item.name.toLowerCase();

    if (normalizedName.includes("áo")) {
      group.tops += item.revenue;
      return;
    }

    if (normalizedName.includes("váy")) {
      group.dresses += item.revenue;
      return;
    }

    if (normalizedName.includes("giày")) {
      group.shoes += item.revenue;
      return;
    }

    group.others += item.revenue;
  });

  const safeTotal = totalRevenue > 0 ? totalRevenue : 1;

  return [
    { id: "tops", label: "Áo/Tops", percent: Math.round((group.tops / safeTotal) * 100) },
    { id: "dresses", label: "Váy", percent: Math.round((group.dresses / safeTotal) * 100) },
    { id: "shoes", label: "Giày", percent: Math.round((group.shoes / safeTotal) * 100) },
    { id: "others", label: "Khác", percent: Math.round((group.others / safeTotal) * 100) },
  ].map((item) => ({ ...item, percent: clamp(item.percent, 5, 70) }));
};

export const getDashboardTopProductsPayload = (params: {
  metric: DashboardTopProductsMetric;
  rangeDays: DashboardTopProductsRange;
  platform: DashboardTopProductsPlatform;
}): DashboardTopProductsPayload => {
  const baseRows = applyRangeFactor(buildAggregatedProducts(), params.rangeDays);
  const scopedRows =
    params.platform === "all"
      ? baseRows
      : baseRows.filter((item) => item.platform === params.platform);

  const ranking = withMetricOrder(scopedRows, params.metric);
  const podium = ranking.slice(0, 3);
  const declining = [...ranking]
    .sort((a, b) => a.trendPercent - b.trendPercent)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      trendPercent: Number((-Math.abs(item.trendPercent || 1.5)).toFixed(1)),
    }));

  return {
    updatedAt: "14:35",
    metric: params.metric,
    rangeDays: params.rangeDays,
    platform: params.platform,
    podium,
    ranking,
    insights: buildInsights(ranking, params.metric),
    contribution: buildContribution(ranking),
    declining,
  };
};
