import { apiClient } from '@/services/apiClient'

import type {
  SettingsStaffPermissionsActivityResponse,
  StaffActivityEntry,
  StaffActivityKind,
  StaffActivitySection,
} from '@/features/settings/logic/settingsStaffPermissionsActivity.types'

type SettingsStaffPermissionsActivityApiResponse = Partial<SettingsStaffPermissionsActivityResponse>

function toActivityKind(value: unknown): StaffActivityKind {
  if (value === 'order' || value === 'export') {
    return value
  }

  return 'inventory'
}

function toEntries(value: unknown): StaffActivityEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `activity-${index}`,
        title: typeof entry.title === 'string' ? entry.title : '--',
        detail: typeof entry.detail === 'string' ? entry.detail : undefined,
        timeLabel: typeof entry.timeLabel === 'string' ? entry.timeLabel : '--:--',
        kind: toActivityKind(entry.kind),
        dimmed: entry.dimmed === true,
      }
    })
}

function toSections(value: unknown): StaffActivitySection[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const section = item as Record<string, unknown>

      return {
        id: typeof section.id === 'string' ? section.id : `section-${index}`,
        label: typeof section.label === 'string' ? section.label : undefined,
        entries: toEntries(section.entries),
      }
    })
}

class SettingsStaffPermissionsActivityService {
  async getMemberActivities(memberId: string): Promise<SettingsStaffPermissionsActivityResponse> {
    const response = await apiClient.get<SettingsStaffPermissionsActivityApiResponse>('/settings/staff-permissions/member-activities', {
      params: { memberId },
    })

    return {
      memberId: response.data?.memberId ?? memberId,
      memberName: response.data?.memberName ?? 'Nhân viên',
      headerTitle: response.data?.headerTitle ?? `Hoạt động — ${response.data?.memberName ?? 'Nhân viên'}`,
      summaryLabel: response.data?.summaryLabel ?? 'Hiển thị 1-20 trong 0 hoạt động',
      sections: toSections(response.data?.sections),
    }
  }
}

export const settingsStaffPermissionsActivityService = new SettingsStaffPermissionsActivityService()