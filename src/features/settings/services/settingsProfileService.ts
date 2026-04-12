import { apiClient } from '@/services/apiClient'

import type {
  SettingsProfileIdentity,
  SettingsProfilePreference,
  SettingsProfileResponse,
  SettingsProfileSecurityCheck,
  SettingsProfileStat,
  SettingsProfileUpdatePayload,
} from '@/features/settings/logic/settingsProfile.types'

type SettingsProfileApiResponse = Partial<SettingsProfileResponse>

function toFiniteNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  return 0
}

function toStats(value: unknown): SettingsProfileStat[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `stat-${index + 1}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        value: toFiniteNumber(entry.value),
        suffix: typeof entry.suffix === 'string' ? entry.suffix : undefined,
      }
    })
}

function toIdentity(value: unknown): SettingsProfileIdentity {
  const entry = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

  return {
    fullName: typeof entry.fullName === 'string' ? entry.fullName : '--',
    email: typeof entry.email === 'string' ? entry.email : '--',
    phone: typeof entry.phone === 'string' ? entry.phone : '--',
    jobTitle: typeof entry.jobTitle === 'string' ? entry.jobTitle : '--',
    timezone: typeof entry.timezone === 'string' ? entry.timezone : 'Asia/Ho_Chi_Minh',
    bio: typeof entry.bio === 'string' ? entry.bio : '',
    location: typeof entry.location === 'string' ? entry.location : '--',
    joinedAt: typeof entry.joinedAt === 'string' ? entry.joinedAt : '',
  }
}

function toPreferences(value: unknown): SettingsProfilePreference[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `preference-${index + 1}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        enabled: entry.enabled === true,
      }
    })
}

function toSecurityChecks(value: unknown): SettingsProfileSecurityCheck[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>
      const status = entry.status === 'warning' ? 'warning' : 'healthy'

      return {
        id: typeof entry.id === 'string' ? entry.id : `security-${index + 1}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        status,
        actionLabel: typeof entry.actionLabel === 'string' ? entry.actionLabel : 'Cập nhật',
      }
    })
}

function toResponse(data: SettingsProfileApiResponse | undefined): SettingsProfileResponse {
  return {
    title: data?.title ?? 'Profile Settings',
    subtitle: data?.subtitle ?? 'Quản lý hồ sơ quản trị và tuỳ chọn vận hành cá nhân.',
    saveButtonLabel: data?.saveButtonLabel ?? 'Lưu thay đổi',
    profileCardTitle: data?.profileCardTitle ?? 'Tài khoản chính',
    profileCardSubtitle: data?.profileCardSubtitle ?? 'Thông tin dùng để hiển thị nội bộ trên hệ thống',
    stats: toStats(data?.stats),
    identity: toIdentity(data?.identity),
    preferences: toPreferences(data?.preferences),
    securityChecks: toSecurityChecks(data?.securityChecks),
    updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
  }
}

class SettingsProfileService {
  async getProfileSettings(): Promise<SettingsProfileResponse> {
    const response = await apiClient.get<SettingsProfileApiResponse>('/settings/profile')

    return toResponse(response.data)
  }

  async updateProfileSettings(payload: SettingsProfileUpdatePayload): Promise<SettingsProfileResponse> {
    const response = await apiClient.patch<SettingsProfileApiResponse>('/settings/profile', payload)

    return toResponse(response.data)
  }
}

export const settingsProfileService = new SettingsProfileService()
