import type {
  AutomationPreviewStepType,
  AutomationRule,
  SettingsAutomationResponse,
  SettingsAutomationViewModel,
} from '@/features/settings/logic/settingsAutomation.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')

const previewTypeLabelMap: Record<AutomationPreviewStepType, string> = {
  trigger: 'STEP 1: TRIGGER',
  condition: 'STEP 2: CONDITION',
  action: 'STEP 3: ACTION',
  notification: 'STEP 4: NOTIFICATION',
}

const previewAccentClassMap: Record<AutomationPreviewStepType, string> = {
  trigger: 'bg-blue-500/15 text-blue-700',
  condition: 'bg-orange-500/15 text-orange-700',
  action: 'bg-emerald-500/15 text-emerald-700',
  notification: 'bg-indigo-500/15 text-indigo-700',
}

function toRunsLabel(value: number): string {
  if (value <= 0) return 'Tắt'

  return `${numberFormatter.format(value)} lần`
}

function toRuleViewModel(rule: AutomationRule) {
  return {
    id: rule.id,
    title: rule.title,
    description: rule.description,
    status: rule.status,
    statusLabel: rule.status === 'on' ? 'ON' : 'OFF',
    runsTodayLabel: toRunsLabel(rule.runsToday),
    tags: rule.tags,
    actions: rule.actions,
  }
}

function pickPreviewFlow(data: SettingsAutomationResponse, selectedRuleId: string | null) {
  if (data.previewFlows.length === 0) {
    return {
      title: 'Xem trước Builder',
      ctaLabel: 'Chỉnh sửa trong builder',
      steps: [],
    }
  }

  const byRuleId = selectedRuleId
    ? data.previewFlows.find((item) => item.ruleId === selectedRuleId)
    : undefined

  return byRuleId ?? data.previewFlows[0]
}

export function buildSettingsAutomationViewModel(params: {
  data: SettingsAutomationResponse
  selectedRuleId: string | null
}): SettingsAutomationViewModel {
  const selectedPreview = pickPreviewFlow(params.data, params.selectedRuleId)

  return {
    title: params.data.title,
    subtitle: params.data.subtitle,
    createRuleLabel: params.data.createRuleLabel,
    stats: params.data.overviewStats.map((item) => ({
      id: item.id,
      icon: item.icon,
      valueLabel: item.suffix ? `${numberFormatter.format(item.value)} ${item.suffix}` : numberFormatter.format(item.value),
      label: item.label,
    })),
    savingChartLabel: params.data.savingChartLabel,
    savingChartPoints: params.data.savingChartPoints.map((item) => item.value),
    tabs: params.data.categories.map((item) => ({
      id: item.id,
      label: item.label,
      countLabel: numberFormatter.format(item.count),
    })),
    rules: params.data.rules.map(toRuleViewModel),
    preview: {
      title: selectedPreview.title,
      ctaLabel: selectedPreview.ctaLabel,
      steps: selectedPreview.steps.map((step) => ({
        id: step.id,
        type: step.type,
        typeLabel: previewTypeLabelMap[step.type],
        title: step.title,
        description: step.description,
        accentClassName: previewAccentClassMap[step.type],
      })),
    },
    loadMoreLabel: params.data.loadMoreLabel,
  }
}
