import { apiClient } from '@/services/apiClient'

import type {
  AutomationCategory,
  AutomationCategoryId,
  AutomationDailySavingPoint,
  AutomationOverviewStat,
  AutomationPreviewFlow,
  AutomationPreviewStep,
  AutomationPreviewStepType,
  AutomationRule,
  AutomationRuleAction,
  AutomationRuleActionTone,
  AutomationRuleStatus,
  SettingsAutomationResponse,
} from '@/features/settings/logic/settingsAutomation.types'

type SettingsAutomationApiResponse = Partial<SettingsAutomationResponse>
type SettingsAutomationRuleStatusApiResponse = {
  id?: string
  status?: unknown
}

const categorySet: AutomationCategoryId[] = ['all', 'orders', 'inventory', 'customers', 'reports']

const previewStepTypeSet: AutomationPreviewStepType[] = ['trigger', 'condition', 'action', 'notification']

const ruleStatusSet: AutomationRuleStatus[] = ['on', 'off']

const actionToneSet: AutomationRuleActionTone[] = ['neutral', 'primary']

function toCategoryId(value: unknown): AutomationCategoryId {
  if (typeof value === 'string' && categorySet.includes(value as AutomationCategoryId)) {
    return value as AutomationCategoryId
  }

  return 'all'
}

function toRuleStatus(value: unknown): AutomationRuleStatus {
  if (typeof value === 'string' && ruleStatusSet.includes(value as AutomationRuleStatus)) {
    return value as AutomationRuleStatus
  }

  return 'off'
}

function toActionTone(value: unknown): AutomationRuleActionTone {
  if (typeof value === 'string' && actionToneSet.includes(value as AutomationRuleActionTone)) {
    return value as AutomationRuleActionTone
  }

  return 'neutral'
}

function toPreviewStepType(value: unknown): AutomationPreviewStepType {
  if (typeof value === 'string' && previewStepTypeSet.includes(value as AutomationPreviewStepType)) {
    return value as AutomationPreviewStepType
  }

  return 'action'
}

function toFiniteNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  return 0
}

function toOverviewStats(value: unknown): AutomationOverviewStat[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `stat-${index + 1}`,
        icon: typeof entry.icon === 'string' ? entry.icon : '⚡',
        value: toFiniteNumber(entry.value),
        suffix: typeof entry.suffix === 'string' ? entry.suffix : undefined,
        label: typeof entry.label === 'string' ? entry.label : '--',
      }
    })
}

function toSavingChartPoints(value: unknown): AutomationDailySavingPoint[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `point-${index + 1}`,
        value: Math.max(0, toFiniteNumber(entry.value)),
      }
    })
}

function toCategories(value: unknown): AutomationCategory[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: toCategoryId(entry.id),
        label: typeof entry.label === 'string' ? entry.label : `Danh mục ${index + 1}`,
        count: Math.max(0, Math.round(toFiniteNumber(entry.count))),
      }
    })
}

function toActions(value: unknown): AutomationRuleAction[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `action-${index + 1}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        tone: toActionTone(entry.tone),
      }
    })
}

function toRules(value: unknown): AutomationRule[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `rule-${index + 1}`,
        category: toCategoryId(entry.category),
        title: typeof entry.title === 'string' ? entry.title : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        status: toRuleStatus(entry.status),
        runsToday: Math.max(0, Math.round(toFiniteNumber(entry.runsToday))),
        tags: Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === 'string') : [],
        actions: toActions(entry.actions),
      }
    })
}

function toPreviewSteps(value: unknown): AutomationPreviewStep[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `step-${index + 1}`,
        type: toPreviewStepType(entry.type),
        title: typeof entry.title === 'string' ? entry.title : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
      }
    })
}

function toPreviewFlows(value: unknown): AutomationPreviewFlow[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        ruleId: typeof entry.ruleId === 'string' ? entry.ruleId : `rule-${index + 1}`,
        title: typeof entry.title === 'string' ? entry.title : 'Xem trước Builder',
        ctaLabel: typeof entry.ctaLabel === 'string' ? entry.ctaLabel : 'Chỉnh sửa trong builder',
        steps: toPreviewSteps(entry.steps),
      }
    })
}

class SettingsAutomationService {
  async getAutomationOverview(category: AutomationCategoryId): Promise<SettingsAutomationResponse> {
    const response = await apiClient.get<SettingsAutomationApiResponse>('/settings/automation', {
      params: {
        category,
      },
    })

    return {
      title: response.data?.title ?? 'Tự động hóa Vận hành',
      subtitle: response.data?.subtitle ?? '~3.5 giờ/ngày tiết kiệm',
      createRuleLabel: response.data?.createRuleLabel ?? 'Tạo quy tắc mới',
      overviewStats: toOverviewStats(response.data?.overviewStats),
      savingChartLabel: response.data?.savingChartLabel ?? 'Tiết kiệm theo ngày',
      savingChartPoints: toSavingChartPoints(response.data?.savingChartPoints),
      categories: toCategories(response.data?.categories),
      rules: toRules(response.data?.rules),
      previewFlows: toPreviewFlows(response.data?.previewFlows),
      loadMoreLabel: response.data?.loadMoreLabel ?? 'Xem thêm quy tắc',
    }
  }

  async updateRuleStatus(ruleId: string, status: AutomationRuleStatus): Promise<{ id: string; status: AutomationRuleStatus }> {
    const response = await apiClient.patch<SettingsAutomationRuleStatusApiResponse>(`/settings/automation/rules/${ruleId}/status`, {
      status,
    })

    return {
      id: typeof response.data?.id === 'string' ? response.data.id : ruleId,
      status: toRuleStatus(response.data?.status ?? status),
    }
  }
}

export const settingsAutomationService = new SettingsAutomationService()
