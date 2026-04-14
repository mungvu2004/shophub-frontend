import type {
  DashboardTopProductItem,
  DashboardTopProductsResponse,
  DashboardTopProductsViewModel,
  TopProductsMetricId,
  TopProductsPlatformBadge,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

const CURRENCY = new Intl.NumberFormat('vi-VN')

const QUANTITY = new Intl.NumberFormat('vi-VN')

const metricTabs: DashboardTopProductsViewModel['metricTabs'] = [
  { id: 'revenue', label: 'Doanh thu' },
  { id: 'quantity', label: 'Số lượng' },
  { id: 'returnRate', label: 'Tỷ lệ hoàn' },
]

const rangeTabs: DashboardTopProductsViewModel['rangeTabs'] = [
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
  { days: 90, label: '90 ngày' },
]

const platformTabs: DashboardTopProductsViewModel['platformTabs'] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'shopee', label: 'Shopee' },
  { id: 'lazada', label: 'Lazada' },
  { id: 'tiktok_shop', label: 'TikTok Shop' },
]

const contributionPalette = ['#3525cd', '#7485ff', '#c7d2fe', '#e2e8f0']

export function getTopProductsSubtitle(metric: TopProductsMetricId) {
  if (metric === 'quantity') {
    return 'Xếp hạng theo số lượng - cập nhật lúc'
  }

  if (metric === 'returnRate') {
    return 'Xếp hạng theo tỷ lệ hoàn - cập nhật lúc'
  }

  return 'Xếp hạng theo doanh thu - cập nhật lúc'
}

const toMoney = (value: number) => `${CURRENCY.format(Math.round(Math.max(0, value)))} ₫`

const toPlatformTone = (platform: TopProductsPlatformId): TopProductsPlatformBadge => {
  if (platform === 'tiktok_shop') return 'tiktok'
  if (platform === 'lazada') return 'lazada'
  return 'shopee'
}

const toPlatformLabel = (platform: TopProductsPlatformId) => {
  if (platform === 'tiktok_shop') return 'TIKTOK'
  if (platform === 'lazada') return 'LAZADA'
  if (platform === 'shopee') return 'SHOPEE'
  return 'ALL'
}

const toTrendBars = (item: DashboardTopProductItem) => {
  const baseline = Math.max(2, Math.min(12, Math.round(Math.abs(item.trendPercent) + 2)))

  return [
    Math.max(3, baseline - 3),
    Math.max(4, baseline - 1),
    Math.max(5, baseline + 1),
    Math.max(6, baseline + 2),
  ]
}

const buildPodiumCards = (
  rows: DashboardTopProductItem[],
  selectedMetric: TopProductsMetricId,
): DashboardTopProductsViewModel['podiumCards'] => {
  const rankOrder: Array<1 | 2 | 3> = [2, 1, 3]

  return rankOrder
    .map((rank) => {
      const item = rows[rank - 1]
      if (!item) return null

      const headlineValue =
        selectedMetric === 'quantity'
          ? `${QUANTITY.format(item.soldQty)} đơn`
          : selectedMetric === 'returnRate'
            ? `${item.returnRate.toFixed(1)}%`
            : toMoney(item.revenue)

      return {
        id: item.id,
        rank,
        name: item.name,
        sku: item.sku,
        platformLabel: toPlatformLabel(item.platform),
        platformTone: toPlatformTone(item.platform),
        imageUrl: item.imageUrl,
        headlineValue,
        trendLabel: `${item.trendPercent > 0 ? '+' : ''}${item.trendPercent.toFixed(1)}%`,
        trendTone: item.trendPercent >= 0 ? 'up' : 'down',
        stats: [
          { id: 'sold', label: 'Đã bán', value: QUANTITY.format(item.soldQty) },
          { id: 'avg', label: 'Giá TB', value: `${Math.round(item.avgPrice / 1000)}k` },
          {
            id: 'return',
            label: 'Hoàn %',
            value: `${item.returnRate.toFixed(1)}%`,
            tone: item.returnRate < 2 ? 'good' : item.returnRate < 4 ? 'neutral' : 'bad',
          },
        ],
      }
    })
    .filter((item): item is DashboardTopProductsViewModel['podiumCards'][number] => Boolean(item))
}

function formatUpdatedAtTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return 'chưa xác định'
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return 'chưa xác định'
  }
}

export const buildDashboardTopProductsViewModel = (params: {
  data: DashboardTopProductsResponse
  selectedMetric: TopProductsMetricId
  selectedRange: TopProductsRangeDays
  selectedPlatform: TopProductsPlatformId
}): DashboardTopProductsViewModel => {
  const { data, selectedMetric, selectedRange, selectedPlatform } = params
  const updatedAtTime = formatUpdatedAtTime(data.updatedAt)

  return {
    title: 'Sản phẩm Bán chạy',
    subtitle: `${getTopProductsSubtitle(selectedMetric)} - cập nhật lúc ${updatedAtTime}`,
    updatedAtLabel: data.updatedAt,
    metricTabs,
    selectedMetric,
    rangeTabs,
    selectedRange,
    platformTabs,
    selectedPlatform,
    podiumCards: buildPodiumCards(data.podium, selectedMetric),
    rankingRows: data.ranking.map((item, index) => ({
      id: item.id,
      rankLabel: String(index + 1).padStart(2, '0'),
      name: item.name,
      sku: item.sku,
      platformLabel: toPlatformLabel(item.platform),
      platformTone: toPlatformTone(item.platform),
      imageUrl: item.imageUrl,
      soldLabel: QUANTITY.format(item.soldQty),
      revenueLabel: toMoney(item.revenue),
      avgPriceLabel: `${Math.round(item.avgPrice / 1000)}k`,
      returnRateLabel: `${item.returnRate.toFixed(1)}%`,
      trendTone: item.trendPercent >= 0 ? 'up' : 'down',
      trendBars: toTrendBars(item),
    })),
    insights: data.insights,
    contribution: data.contribution.map((item, index) => ({
      ...item,
      color: contributionPalette[index % contributionPalette.length],
    })),
    contributionTotalLabel: String(Math.min(20, data.ranking.length)),
    decliningTitle: 'Sản phẩm đang giảm',
    decliningItems: data.declining.slice(0, 3).map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      trendLabel: `${item.trendPercent.toFixed(1)}%`,
      trendTone: item.trendPercent <= 0 ? 'down' : 'up',
    })),
    hasData: data.ranking.length > 0,
  }
}
