import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { toast } from '@/components/ui/toast'
import { AutomationLogsDrawer } from '@/features/settings/components/automation-logs/AutomationLogsDrawer'
import { SettingsAutomationView } from '@/features/settings/components/automation/SettingsAutomationView'
import { useSettingsAutomation, useToggleSettingsAutomationRuleStatus } from '@/features/settings/hooks/useSettingsAutomation'
import { buildSettingsAutomationViewModel } from '@/features/settings/logic/settingsAutomation.logic'
import type { AutomationCategoryId } from '@/features/settings/logic/settingsAutomation.types'

export function SettingsAutomation() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<AutomationCategoryId>('all')
  const { data, isLoading, isFetching, isError, refetch } = useSettingsAutomation({
    category: selectedCategory,
  })
  const { toggleRuleStatus } = useToggleSettingsAutomationRuleStatus()

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [logsRuleId, setLogsRuleId] = useState<string | null>(null)
  const [togglingRuleId, setTogglingRuleId] = useState<string | null>(null)

  useEffect(() => {
    if (!data?.rules.length) {
      setSelectedRuleId(null)
      return
    }

    const hasSelectedRule = selectedRuleId
      ? data.rules.some((rule) => rule.id === selectedRuleId)
      : false

    if (!hasSelectedRule) {
      setSelectedRuleId(data.rules[0].id)
    }
  }, [data, selectedRuleId])

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildSettingsAutomationViewModel({
      data,
      selectedRuleId,
    })
  }, [data, selectedRuleId])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu tự động hóa...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu tự động hóa vận hành.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <>
      <SettingsAutomationView
        model={model}
        selectedCategory={selectedCategory}
        selectedRuleId={selectedRuleId}
        onCategoryChange={setSelectedCategory}
        onRuleSelect={setSelectedRuleId}
        onRuleStatusToggle={async (ruleId, nextStatus) => {
          setTogglingRuleId(ruleId)

          try {
            await toggleRuleStatus({ ruleId, status: nextStatus })
            toast.success(nextStatus === 'on' ? 'Đã bật quy tắc tự động.' : 'Đã tắt quy tắc tự động.')
          } catch {
            toast.error('Không thể cập nhật trạng thái quy tắc. Vui lòng thử lại.')
          } finally {
            setTogglingRuleId(null)
          }
        }}
        onRuleActionClick={(ruleId, _ruleTitle, actionId, actionLabel) => {
          if (actionLabel.toLowerCase() === 'logs' || actionId.endsWith('-logs')) {
            setLogsRuleId(ruleId)
            return
          }

          if (actionLabel.toLowerCase() === 'sửa' || actionId.endsWith('-edit')) {
            navigate('/settings/automation/new-rule', {
              state: {
                ruleId,
              },
            })
            return
          }

          toast.info(`${actionLabel}: đang cập nhật chức năng.`)
        }}
        onCreateRule={() => navigate('/settings/automation/new-rule')}
        togglingRuleId={togglingRuleId}
        isRefreshing={isFetching}
      />
      <AutomationLogsDrawer open={Boolean(logsRuleId)} ruleId={logsRuleId} onClose={() => setLogsRuleId(null)} />
    </>
  )
}
