import { useEffect, useMemo, useState } from 'react'

import { AutomationLogsFooter } from '@/features/settings/components/automation-logs/AutomationLogsFooter'
import { AutomationLogsHeader } from '@/features/settings/components/automation-logs/AutomationLogsHeader'
import { AutomationLogsStatusTabs } from '@/features/settings/components/automation-logs/AutomationLogsStatusTabs'
import { AutomationLogsTable } from '@/features/settings/components/automation-logs/AutomationLogsTable'
import { useSettingsAutomationLogs } from '@/features/settings/hooks/useSettingsAutomationLogs'
import { buildSettingsAutomationLogsViewModel } from '@/features/settings/logic/settingsAutomationLogs.logic'
import type { AutomationLogStatusFilter } from '@/features/settings/logic/settingsAutomationLogs.types'

type AutomationLogsDrawerProps = {
  open: boolean
  ruleId: string | null
  onClose: () => void
}

export function AutomationLogsDrawer({ open, ruleId, onClose }: AutomationLogsDrawerProps) {
  const [status, setStatus] = useState<AutomationLogStatusFilter>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    if (!open) return
    setStatus('all')
    setPage(1)
  }, [open, ruleId])

  const { data, isLoading, isError, refetch } = useSettingsAutomationLogs({
    ruleId: ruleId ?? '',
    status,
    page,
    pageSize,
    enabled: open,
  })

  const model = useMemo(() => {
    if (!data) return null
    return buildSettingsAutomationLogsViewModel(data)
  }, [data])

  if (!open) {
    return null
  }

  const totalPages = model ? Math.max(1, Math.ceil(model.totalCount / model.pageSize)) : 1

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="overlay" className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose} />

      <aside className="relative z-[1] flex h-full w-full max-w-[520px] animate-[slideIn_180ms_ease-out] flex-col border-l border-slate-200 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <AutomationLogsHeader title={model?.title ?? 'Run Log'} onClose={onClose} />

        {isLoading && !model ? <div className="px-6 py-4 text-sm text-slate-500">Đang tải run log...</div> : null}

        {isError || !model ? (
          <div className="space-y-3 px-6 py-4">
            <p className="text-sm font-semibold text-rose-700">Không tải được run log.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <AutomationLogsStatusTabs
              tabs={model.tabs}
              value={status}
              onChange={(nextStatus) => {
                setStatus(nextStatus)
                setPage(1)
              }}
            />
            <AutomationLogsTable rows={model.rows} />
            <AutomationLogsFooter
              totalLabel={model.totalRunsTodayLabel}
              page={model.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </aside>
    </div>
  )
}
