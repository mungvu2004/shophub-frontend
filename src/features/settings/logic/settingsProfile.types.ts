export type SettingsProfilePreference = {
  id: string
  label: string
  description: string
  enabled: boolean
}

export type SettingsProfileSecurityCheck = {
  id: string
  label: string
  description: string
  status: 'healthy' | 'warning'
  actionLabel: string
}

export type SettingsProfileStat = {
  id: string
  label: string
  value: number
  suffix?: string
}

export type SettingsProfileIdentity = {
  fullName: string
  email: string
  phone: string
  jobTitle: string
  timezone: string
  bio: string
  location: string
  joinedAt: string
}

export type SettingsProfileResponse = {
  title: string
  subtitle: string
  saveButtonLabel: string
  profileCardTitle: string
  profileCardSubtitle: string
  stats: SettingsProfileStat[]
  identity: SettingsProfileIdentity
  preferences: SettingsProfilePreference[]
  securityChecks: SettingsProfileSecurityCheck[]
  updatedAt: string
}

export type SettingsProfileUpdatePayload = {
  identity: {
    fullName: string
    phone: string
    jobTitle: string
    timezone: string
    bio: string
  }
  preferences: Array<{
    id: string
    enabled: boolean
  }>
}

export type ProfileFormDraft = {
  fullName: string
  phone: string
  jobTitle: string
  timezone: string
  bio: string
}

export type SettingsProfileViewModel = {
  title: string
  subtitle: string
  saveButtonLabel: string
  isSaving: boolean
  updatedAtLabel: string
  profileCard: {
    title: string
    subtitle: string
    initials: string
    email: string
    location: string
    joinedAtLabel: string
  }
  stats: Array<{
    id: string
    label: string
    valueLabel: string
  }>
  form: {
    fullNameLabel: string
    phoneLabel: string
    jobTitleLabel: string
    timezoneLabel: string
    bioLabel: string
    emailLabel: string
    emailValue: string
    values: ProfileFormDraft
  }
  preferences: SettingsProfilePreference[]
  securityChecks: SettingsProfileSecurityCheck[]
}
