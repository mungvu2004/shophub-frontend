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
      { id: 'auto-1', executedAt: '2026-04-04T14:32:05+07:00', orderCode: 'SPE-001247', platform: 'shopee', status: 'success', detail: 'Tồn kho: 45 units' },
      { id: 'auto-2', executedAt: '2026-04-04T14:28:12+07:00', orderCode: 'TKT-998231', platform: 'tiktok_shop', status: 'success', detail: 'Tồn kho: 12 units' },
      { id: 'auto-3', executedAt: '2026-04-04T14:25:00+07:00', orderCode: 'SPE-001246', platform: 'shopee', status: 'error', detail: 'Tồn kho không đủ (0)' },
      { id: 'auto-4', executedAt: '2026-04-04T14:20:44+07:00', orderCode: 'SPE-001245', platform: 'shopee', status: 'success', detail: 'Tồn kho: 88 units' },
      { id: 'auto-5', executedAt: '2026-04-04T14:15:22+07:00', orderCode: 'TKT-998230', platform: 'tiktok_shop', status: 'success', detail: 'Tồn kho: 5 units' },
      { id: 'auto-6', executedAt: '2026-04-04T14:10:05+07:00', orderCode: 'SPE-001244', platform: 'shopee', status: 'success', detail: 'Tồn kho: 102 units' },
      { id: 'auto-7', executedAt: '2026-04-04T14:05:12+07:00', orderCode: 'SPE-001243', platform: 'shopee', status: 'success', detail: 'Tồn kho: 15 units' },
      { id: 'auto-8', executedAt: '2026-04-04T14:02:44+07:00', orderCode: 'TKT-998229', platform: 'tiktok_shop', status: 'error', detail: 'API TikTok timeout' },
      { id: 'auto-9', executedAt: '2026-04-04T13:58:30+07:00', orderCode: 'SPE-001242', platform: 'shopee', status: 'success', detail: 'Tồn kho: 22 units' },
      { id: 'auto-10', executedAt: '2026-04-04T13:55:10+07:00', orderCode: 'SPE-001241', platform: 'shopee', status: 'success', detail: 'Tồn kho: 10 units' },
      { id: 'auto-11', executedAt: '2026-04-04T13:49:31+07:00', orderCode: 'LZD-887612', platform: 'lazada', status: 'success', detail: 'Lazada tồn kho: 27 units' },
      { id: 'auto-12', executedAt: '2026-04-04T13:44:05+07:00', orderCode: 'LZD-887603', platform: 'lazada', status: 'error', detail: 'Lazada API rate limit' },
    ],
  },
  {
    ruleId: 'rule-lazada-sla-monitor',
    ruleTitle: 'Theo dõi SLA Lazada',
    totalRunsToday: 8,
    items: [
      { id: 'lzd-1', executedAt: '2026-04-04T14:30:14+07:00', orderCode: 'LZD-334921', platform: 'lazada', status: 'success', detail: 'Đã gắn nhãn ưu tiên SLA' },
      { id: 'lzd-2', executedAt: '2026-04-04T13:50:11+07:00', orderCode: 'LZD-334912', platform: 'lazada', status: 'success', detail: 'Đã ping team vận hành' },
      { id: 'lzd-3', executedAt: '2026-04-04T13:12:07+07:00', orderCode: 'LZD-334901', platform: 'lazada', status: 'error', detail: 'Webhook callback chậm > 5s' },
      { id: 'lzd-4', executedAt: '2026-04-04T12:20:01+07:00', orderCode: 'LZD-334880', platform: 'lazada', status: 'success', detail: 'Đã cập nhật SLA queue' },
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
