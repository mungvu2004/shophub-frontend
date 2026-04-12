import { http, HttpResponse } from 'msw'

import { settingsAutomationMock } from '@/mocks/data/settingsAutomation'
import { settingsAutomationBuilderMock } from '@/mocks/data/settingsAutomationBuilder'
import { buildSettingsAutomationLogsMock } from '@/mocks/data/settingsAutomationLogs'
import { settingsPlatformConnectionsMock } from '@/mocks/data/settingsPlatformConnections'
import { settingsProfileMock } from '@/mocks/data/settingsProfile'
import { settingsStaffPermissionsActivitiesMock } from '@/mocks/data/settingsStaffPermissionsActivities'
import { settingsStaffPermissionsMock } from '@/mocks/data/settingsStaffPermissions'
import { settingsStaffPermissionsInviteMock } from '@/mocks/data/settingsStaffPermissionsInvite'

const automationRulesState = settingsAutomationMock.rules.map((rule) => ({
  ...rule,
  tags: [...rule.tags],
  actions: rule.actions.map((action) => ({ ...action })),
}))

const settingsProfileState = {
  ...settingsProfileMock,
  identity: {
    ...settingsProfileMock.identity,
  },
  preferences: settingsProfileMock.preferences.map((item) => ({ ...item })),
  securityChecks: settingsProfileMock.securityChecks.map((item) => ({ ...item })),
  stats: settingsProfileMock.stats.map((item) => ({ ...item })),
}

export const settingsHandlers = [
  http.get('/api/settings/automation', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') ?? 'all'

    if (category === 'all') {
      return HttpResponse.json(
        {
          ...settingsAutomationMock,
          rules: automationRulesState,
        },
        { status: 200 },
      )
    }

    return HttpResponse.json(
      {
        ...settingsAutomationMock,
        rules: automationRulesState.filter((rule) => rule.category === category),
      },
      { status: 200 },
    )
  }),
  http.patch('/api/settings/automation/rules/:ruleId/status', async ({ params, request }) => {
    const payload = (await request.json().catch(() => null)) as { status?: unknown } | null
    const nextStatus = payload?.status

    if (nextStatus !== 'on' && nextStatus !== 'off') {
      return HttpResponse.json({ message: 'Invalid status payload.' }, { status: 400 })
    }

    const ruleId = typeof params.ruleId === 'string' ? params.ruleId : ''
    const targetRule = automationRulesState.find((rule) => rule.id === ruleId)

    if (!targetRule) {
      return HttpResponse.json({ message: 'Rule not found.' }, { status: 404 })
    }

    targetRule.status = nextStatus

    return HttpResponse.json({ id: targetRule.id, status: targetRule.status }, { status: 200 })
  }),
  http.get('/api/settings/automation/builder', () => HttpResponse.json(settingsAutomationBuilderMock, { status: 200 })),
  http.get('/api/settings/automation/rule-logs', ({ request }) => {
    const url = new URL(request.url)
    const ruleId = url.searchParams.get('ruleId') ?? ''
    const statusParam = url.searchParams.get('status')
    const pageParam = Number(url.searchParams.get('page') ?? '1')
    const pageSizeParam = Number(url.searchParams.get('pageSize') ?? '10')

    return HttpResponse.json(
      buildSettingsAutomationLogsMock({
        ruleId,
        status: statusParam === 'success' || statusParam === 'error' ? statusParam : 'all',
        page: Number.isFinite(pageParam) ? pageParam : 1,
        pageSize: Number.isFinite(pageSizeParam) ? pageSizeParam : 10,
      }),
      { status: 200 },
    )
  }),
  http.get('/api/settings/platform-connections', () => HttpResponse.json(settingsPlatformConnectionsMock, { status: 200 })),
  http.get('/api/settings/profile', () => HttpResponse.json(settingsProfileState, { status: 200 })),
  http.patch('/api/settings/profile', async ({ request }) => {
    const payload = (await request.json().catch(() => null)) as {
      identity?: {
        fullName?: unknown
        phone?: unknown
        jobTitle?: unknown
        timezone?: unknown
        bio?: unknown
      }
      preferences?: Array<{
        id?: unknown
        enabled?: unknown
      }>
    } | null

    if (payload?.identity) {
      const { identity } = payload

      settingsProfileState.identity = {
        ...settingsProfileState.identity,
        fullName: typeof identity.fullName === 'string' ? identity.fullName : settingsProfileState.identity.fullName,
        phone: typeof identity.phone === 'string' ? identity.phone : settingsProfileState.identity.phone,
        jobTitle: typeof identity.jobTitle === 'string' ? identity.jobTitle : settingsProfileState.identity.jobTitle,
        timezone: typeof identity.timezone === 'string' ? identity.timezone : settingsProfileState.identity.timezone,
        bio: typeof identity.bio === 'string' ? identity.bio : settingsProfileState.identity.bio,
      }
    }

    if (Array.isArray(payload?.preferences)) {
      settingsProfileState.preferences = settingsProfileState.preferences.map((item) => {
        const next = payload.preferences?.find((entry) => entry.id === item.id)

        if (!next || typeof next.enabled !== 'boolean') {
          return item
        }

        return {
          ...item,
          enabled: next.enabled,
        }
      })
    }

    settingsProfileState.updatedAt = new Date().toISOString()

    return HttpResponse.json(settingsProfileState, { status: 200 })
  }),
  http.get('/api/settings/staff-permissions', () => HttpResponse.json(settingsStaffPermissionsMock, { status: 200 })),
  http.get('/api/settings/staff-permissions/invite', () => HttpResponse.json(settingsStaffPermissionsInviteMock, { status: 200 })),
  http.get('/api/settings/staff-permissions/member-activities', ({ request }) => {
    const url = new URL(request.url)
    const memberId = url.searchParams.get('memberId') ?? ''

    const activity = settingsStaffPermissionsActivitiesMock[memberId] ?? {
      memberId,
      memberName: 'Nhân viên',
      headerTitle: 'Hoạt động — Nhân viên',
      summaryLabel: 'Hiển thị 1-20 trong 0 hoạt động',
      sections: [],
    }

    return HttpResponse.json(activity, { status: 200 })
  }),
]
