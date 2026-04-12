import type {
  ProfileFormDraft,
  SettingsProfilePreference,
  SettingsProfileResponse,
  SettingsProfileSecurityCheck,
  SettingsProfileViewModel,
} from '@/features/settings/logic/settingsProfile.types'

function toInitials(fullName: string): string {
  const parts = fullName
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (!parts.length) {
    return 'NA'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function toDateTimeLabel(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--/--/---- --:--'
  }

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const numberFormatter = new Intl.NumberFormat('vi-VN')

function toStatValueLabel(value: number, suffix?: string): string {
  const base = numberFormatter.format(value)

  return suffix ? `${base}${suffix}` : base
}

function toPreferences(value: SettingsProfileResponse['preferences']): SettingsProfilePreference[] {
  return value.map((item) => ({ ...item }))
}

function toSecurityChecks(value: SettingsProfileResponse['securityChecks']): SettingsProfileSecurityCheck[] {
  return value.map((item) => ({ ...item }))
}

export function buildSettingsProfileViewModel(params: {
  data: SettingsProfileResponse
  draft: ProfileFormDraft
  preferenceDraft: Record<string, boolean>
  isSaving: boolean
}): SettingsProfileViewModel {
  const { data, draft, preferenceDraft, isSaving } = params

  return {
    title: data.title,
    subtitle: data.subtitle,
    saveButtonLabel: data.saveButtonLabel,
    isSaving,
    updatedAtLabel: `Cập nhật lần cuối: ${toDateTimeLabel(data.updatedAt)}`,
    profileCard: {
      title: data.profileCardTitle,
      subtitle: data.profileCardSubtitle,
      initials: toInitials(data.identity.fullName),
      email: data.identity.email,
      location: data.identity.location,
      joinedAtLabel: `Tham gia từ ${toDateTimeLabel(data.identity.joinedAt)}`,
    },
    stats: data.stats.map((stat) => ({
      id: stat.id,
      label: stat.label,
      valueLabel: toStatValueLabel(stat.value, stat.suffix),
    })),
    form: {
      fullNameLabel: 'Họ và tên',
      phoneLabel: 'Số điện thoại',
      jobTitleLabel: 'Chức danh',
      timezoneLabel: 'Múi giờ',
      bioLabel: 'Giới thiệu ngắn',
      emailLabel: 'Email đăng nhập',
      emailValue: data.identity.email,
      values: draft,
    },
    preferences: toPreferences(data.preferences).map((item) => ({
      ...item,
      enabled: preferenceDraft[item.id] ?? item.enabled,
    })),
    securityChecks: toSecurityChecks(data.securityChecks),
  }
}
