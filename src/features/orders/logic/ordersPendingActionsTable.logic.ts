import type { OrdersPendingActionsTableRowModel } from '@/features/orders/logic/ordersPendingActions.types'

export type PendingActionsTableSortKey = 'amount' | 'waiting' | 'updated'
export type PendingActionsTableSortDirection = 'asc' | 'desc'
export type PendingActionsTableColumnKey = 'platform' | 'product' | 'amount' | 'status' | 'waiting' | 'printStatus' | 'action' | 'updated'

export const PENDING_ACTIONS_INITIAL_VISIBLE_COLUMNS: Record<PendingActionsTableColumnKey, boolean> = {
  platform: true,
  product: true,
  amount: true,
  status: true,
  waiting: true,
  printStatus: true,
  action: true,
  updated: true,
}

export function sortPendingActionsRows(
  rows: OrdersPendingActionsTableRowModel[],
  sortKey: PendingActionsTableSortKey,
  sortDirection: PendingActionsTableSortDirection,
) {
  const sorted = [...rows]

  sorted.sort((a, b) => {
    const value =
      sortKey === 'amount'
        ? a.amountValue - b.amountValue
        : sortKey === 'updated'
          ? a.updatedAtMs - b.updatedAtMs
          : a.waitingMinutes - b.waitingMinutes

    if (value === 0) return a.orderCode.localeCompare(b.orderCode)
    return sortDirection === 'asc' ? value : -value
  })

  return sorted
}

export function canToggleColumn(
  visibleColumns: Record<PendingActionsTableColumnKey, boolean>,
  checked: boolean,
) {
  if (checked) return true
  const enabledCount = Object.values(visibleColumns).filter(Boolean).length
  return enabledCount > 1
}

export function countVisibleDataColumns(visibleColumns: Record<PendingActionsTableColumnKey, boolean>) {
  return Object.values(visibleColumns).filter(Boolean).length
}

type ChartItem = {
  label: string
  count: number
  percent: number
  colorClass: string
}

function toPercentages(counts: number[]) {
  const total = counts.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return counts.map(() => 0)
  return counts.map((value) => Math.round((value / total) * 100))
}

export function buildPendingActionsCharts(rows: OrdersPendingActionsTableRowModel[]): {
  slaItems: ChartItem[]
  platformItems: ChartItem[]
} {
  const slaCounts = {
    critical: rows.filter((row) => row.waitingMinutes > 120).length,
    warning: rows.filter((row) => row.waitingMinutes >= 60 && row.waitingMinutes <= 120).length,
    safe: rows.filter((row) => row.waitingMinutes < 60).length,
  }
  const slaPercents = toPercentages([slaCounts.critical, slaCounts.warning, slaCounts.safe])

  const platformCounts = {
    Shopee: rows.filter((row) => row.platformLabel === 'Shopee').length,
    Lazada: rows.filter((row) => row.platformLabel === 'Lazada').length,
    TikTok: rows.filter((row) => row.platformLabel.includes('TikTok')).length,
  }
  const platformPercents = toPercentages([platformCounts.Shopee, platformCounts.Lazada, platformCounts.TikTok])

  return {
    slaItems: [
      { label: 'Nguy cấp', count: slaCounts.critical, percent: slaPercents[0], colorClass: 'bg-rose-500' },
      { label: 'Cảnh báo', count: slaCounts.warning, percent: slaPercents[1], colorClass: 'bg-amber-500' },
      { label: 'Ổn định', count: slaCounts.safe, percent: slaPercents[2], colorClass: 'bg-emerald-500' },
    ],
    platformItems: [
      { label: 'Shopee', count: platformCounts.Shopee, percent: platformPercents[0], colorClass: 'bg-orange-500' },
      { label: 'Lazada', count: platformCounts.Lazada, percent: platformPercents[1], colorClass: 'bg-blue-500' },
      { label: 'TikTok Shop', count: platformCounts.TikTok, percent: platformPercents[2], colorClass: 'bg-slate-700' },
    ],
  }
}
