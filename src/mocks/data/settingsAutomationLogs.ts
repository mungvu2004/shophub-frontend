import type {
  AutomationLogStatusFilter,
  SettingsAutomationRuleLogsResponse,
} from '@/features/settings/logic/settingsAutomationLogs.types'

type RuleLogSeed = {
  ruleId: string
  ruleTitle: string
  totalRunsToday: number
  items: SettingsAutomationRuleLogsResponse['items']
}

const ruleLogSeeds: RuleLogSeed[] = [
  {
    ruleId: 'rule-auto-confirm-order',
    ruleTitle: 'Xác nhận đơn hàng tự động',
    totalRunsToday: 89,
    items: [
      { id: 'auto-1', executedAt: '2026-05-05T14:32:05+07:00', orderCode: 'SHOPEE-1047', platform: 'shopee', status: 'success', detail: 'Tồn kho: 45 units' },
      { id: 'auto-2', executedAt: '2026-05-05T14:28:12+07:00', orderCode: 'TIKTOK_SHOP-1033', platform: 'tiktok_shop', status: 'success', detail: 'Tồn kho: 12 units' },
      { id: 'auto-3', executedAt: '2026-05-05T14:25:00+07:00', orderCode: 'SHOPEE-1044', platform: 'shopee', status: 'error', detail: 'Tồn kho không đủ (0)' },
      { id: 'auto-4', executedAt: '2026-05-05T14:20:44+07:00', orderCode: 'SHOPEE-1041', platform: 'shopee', status: 'success', detail: 'Tồn kho: 88 units' },
      { id: 'auto-5', executedAt: '2026-05-05T14:15:22+07:00', orderCode: 'TIKTOK_SHOP-1030', platform: 'tiktok_shop', status: 'success', detail: 'Tồn kho: 5 units' },
      { id: 'auto-6', executedAt: '2026-05-05T14:10:05+07:00', orderCode: 'SHOPEE-1038', platform: 'shopee', status: 'success', detail: 'Tồn kho: 102 units' },
      { id: 'auto-7', executedAt: '2026-05-05T14:05:12+07:00', orderCode: 'SHOPEE-1035', platform: 'shopee', status: 'success', detail: 'Tồn kho: 15 units' },
      { id: 'auto-8', executedAt: '2026-05-05T14:02:44+07:00', orderCode: 'TIKTOK_SHOP-1027', platform: 'tiktok_shop', status: 'error', detail: 'API TikTok timeout' },
      { id: 'auto-9', executedAt: '2026-05-05T13:58:30+07:00', orderCode: 'SHOPEE-1032', platform: 'shopee', status: 'success', detail: 'Tồn kho: 22 units' },
      { id: 'auto-10', executedAt: '2026-05-05T13:55:10+07:00', orderCode: 'SHOPEE-1029', platform: 'shopee', status: 'success', detail: 'Tồn kho: 10 units' },
      { id: 'auto-11', executedAt: '2026-05-05T13:49:31+07:00', orderCode: 'LAZADA-1046', platform: 'lazada', status: 'success', detail: 'Lazada tồn kho: 27 units' },
      { id: 'auto-12', executedAt: '2026-05-05T13:44:05+07:00', orderCode: 'LAZADA-1043', platform: 'lazada', status: 'error', detail: 'Lazada API rate limit' },
    ],
  },
  {
    ruleId: 'rule-lazada-sla-monitor',
    ruleTitle: 'Theo dõi SLA Lazada',
    totalRunsToday: 8,
    items: [
      { id: 'lzd-1', executedAt: '2026-05-05T14:30:14+07:00', orderCode: 'LAZADA-1049', platform: 'lazada', status: 'success', detail: 'Đã gắn nhãn ưu tiên SLA' },
      { id: 'lzd-2', executedAt: '2026-05-05T13:50:11+07:00', orderCode: 'LAZADA-1037', platform: 'lazada', status: 'success', detail: 'Đã ping team vận hành' },
      { id: 'lzd-3', executedAt: '2026-05-05T13:12:07+07:00', orderCode: 'LAZADA-1034', platform: 'lazada', status: 'error', detail: 'Webhook callback chậm > 5s' },
      { id: 'lzd-4', executedAt: '2026-05-05T12:20:01+07:00', orderCode: 'LAZADA-1031', platform: 'lazada', status: 'success', detail: 'Đã cập nhật SLA queue' },
    ],
  },
  {
    ruleId: 'rule-tiktok-instant-refund',
    ruleTitle: 'Hoàn tiền tự động TikTok',
    totalRunsToday: 15,
    items: [
      { id: 'ttk-1', executedAt: '2026-05-05T14:20:00+07:00', orderCode: 'TIKTOK_SHOP-1048', platform: 'tiktok_shop', status: 'success', detail: 'Hoàn tiền thành công: 450K' },
      { id: 'ttk-2', executedAt: '2026-05-05T13:45:00+07:00', orderCode: 'TIKTOK_SHOP-1045', platform: 'tiktok_shop', status: 'success', detail: 'Hoàn tiền: 380K' },
      { id: 'ttk-3', executedAt: '2026-05-05T13:15:00+07:00', orderCode: 'TIKTOK_SHOP-1042', platform: 'tiktok_shop', status: 'error', detail: 'TikTok API rate limit' },
    ],
  },
  {
    ruleId: 'rule-low-stock-alert',
    ruleTitle: 'Cảnh báo tồn kho thấp',
    totalRunsToday: 3,
    items: [
      { id: 'inv-1', executedAt: '2026-05-05T14:00:00+07:00', orderCode: 'SHOPEE-1031', platform: 'shopee', status: 'success', detail: 'SKU-001 stock: 8 units (<10)' },
      { id: 'inv-2', executedAt: '2026-05-05T12:30:00+07:00', orderCode: 'LAZADA-1045', platform: 'lazada', status: 'success', detail: 'SKU-045 stock: 6 units (<10)' },
    ],
  },
]

export function buildSettingsAutomationLogsMock(params: {
  ruleId: string
  status: AutomationLogStatusFilter
  page: number
  pageSize: number
}): SettingsAutomationRuleLogsResponse {
  const source = ruleLogSeeds.find((item) => item.ruleId === params.ruleId) ?? {
    ruleId: params.ruleId,
    ruleTitle: 'Run Log',
    totalRunsToday: 0,
    items: [],
  }

  const filteredItems = params.status === 'all'
    ? source.items
    : source.items.filter((item) => item.status === params.status)

  const safePage = Math.max(1, params.page)
  const safePageSize = Math.max(1, params.pageSize)
  const start = (safePage - 1) * safePageSize

  return {
    ruleId: source.ruleId,
    ruleTitle: source.ruleTitle,
    totalRunsToday: source.totalRunsToday,
    page: safePage,
    pageSize: safePageSize,
    totalCount: filteredItems.length,
    items: filteredItems.slice(start, start + safePageSize),
  }
}
