import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { SettingsAutomationRuleLogsViewModel } from '@/features/settings/logic/settingsAutomationLogs.types'

type AutomationLogsTableProps = {
  rows: SettingsAutomationRuleLogsViewModel['rows']
}

export function AutomationLogsTable({ rows }: AutomationLogsTableProps) {
  return (
    <div className="overflow-hidden px-0">
      <div className="grid grid-cols-[108px_112px_140px_1fr] border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-500">
        <span>Thời gian</span>
        <span>Đơn hàng</span>
        <span>Kết quả</span>
        <span>Chi tiết</span>
      </div>

      <div className="max-h-[540px] overflow-y-auto">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[108px_112px_140px_1fr] border-b border-slate-100 px-6 py-3 text-[12px]">
            <span className="font-mono text-slate-500">{row.timeLabel}</span>
            <span className="font-mono font-semibold text-slate-900">{row.orderCode}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-bold',
                row.status === 'success' ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {row.status === 'success' ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
              {row.statusLabel}
            </span>
            <span className={cn('text-[11px]', row.status === 'success' ? 'text-slate-500' : 'text-rose-600')}>
              {row.platformLabel}: {row.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
