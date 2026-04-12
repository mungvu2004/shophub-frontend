import type {
  SettingsAutomationRuleLogsResponse,
  SettingsAutomationRuleLogsViewModel,
} from '@/features/settings/logic/settingsAutomationLogs.types'

const platformLabelMap = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok Shop',
} as const

function toTimeLabel(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--:--:--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function buildSettingsAutomationLogsViewModel(
  response: SettingsAutomationRuleLogsResponse,
): SettingsAutomationRuleLogsViewModel {
  return {
    title: `Run Log - ${response.ruleTitle}`,
    totalRunsTodayLabel: `Tổng: ${response.totalRunsToday} lần chạy hôm nay`,
    tabs: [
      { id: 'all', label: 'Tất cả' },
      { id: 'success', label: 'Thành công' },
      { id: 'error', label: 'Lỗi' },
    ],
    rows: response.items.map((item) => ({
      id: item.id,
      timeLabel: toTimeLabel(item.executedAt),
      orderCode: item.orderCode,
      status: item.status,
      statusLabel: item.status === 'success' ? 'Đã xác nhận' : 'Lỗi kết nối',
      detail: item.detail,
      platformLabel: platformLabelMap[item.platform],
    })),
    page: response.page,
    pageSize: response.pageSize,
    totalCount: response.totalCount,
  }
}
