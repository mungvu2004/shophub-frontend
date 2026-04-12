export type AutomationCategoryId = 'all' | 'orders' | 'inventory' | 'customers' | 'reports'

export type AutomationRuleStatus = 'on' | 'off'

export type AutomationRuleActionTone = 'neutral' | 'primary'

export type AutomationRuleAction = {
  id: string
  label: string
  tone: AutomationRuleActionTone
}

export type AutomationPreviewStepType = 'trigger' | 'condition' | 'action' | 'notification'

export type AutomationOverviewStat = {
  id: string
  icon: string
  value: number
  suffix?: string
  label: string
}

export type AutomationDailySavingPoint = {
  id: string
  value: number
}

export type AutomationCategory = {
  id: AutomationCategoryId
  label: string
  count: number
}

export type AutomationRule = {
  id: string
  category: AutomationCategoryId
  title: string
  description: string
  status: AutomationRuleStatus
  runsToday: number
  tags: string[]
  actions: AutomationRuleAction[]
}

export type AutomationPreviewStep = {
  id: string
  type: AutomationPreviewStepType
  title: string
  description: string
}

export type AutomationPreviewFlow = {
  ruleId: string
  title: string
  ctaLabel: string
  steps: AutomationPreviewStep[]
}

export type SettingsAutomationResponse = {
  title: string
  subtitle: string
  createRuleLabel: string
  overviewStats: AutomationOverviewStat[]
  savingChartLabel: string
  savingChartPoints: AutomationDailySavingPoint[]
  categories: AutomationCategory[]
  rules: AutomationRule[]
  previewFlows: AutomationPreviewFlow[]
  loadMoreLabel: string
}

export type AutomationOverviewStatViewModel = {
  id: string
  icon: string
  valueLabel: string
  label: string
}

export type AutomationCategoryTabViewModel = {
  id: AutomationCategoryId
  label: string
  countLabel: string
}

export type AutomationRuleViewModel = {
  id: string
  title: string
  description: string
  status: AutomationRuleStatus
  statusLabel: string
  runsTodayLabel: string
  tags: string[]
  actions: AutomationRuleAction[]
}

export type AutomationPreviewStepViewModel = {
  id: string
  type: AutomationPreviewStepType
  typeLabel: string
  title: string
  description: string
  accentClassName: string
}

export type AutomationPreviewFlowViewModel = {
  title: string
  ctaLabel: string
  steps: AutomationPreviewStepViewModel[]
}

export type SettingsAutomationViewModel = {
  title: string
  subtitle: string
  createRuleLabel: string
  stats: AutomationOverviewStatViewModel[]
  savingChartLabel: string
  savingChartPoints: number[]
  tabs: AutomationCategoryTabViewModel[]
  rules: AutomationRuleViewModel[]
  preview: AutomationPreviewFlowViewModel
  loadMoreLabel: string
}
