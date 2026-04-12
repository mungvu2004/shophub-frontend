import { Button } from '@/components/ui/button'
import type { ProfileFormDraft, SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

import { ProfileFormSection } from '@/features/settings/components/profile-settings/ProfileFormSection'
import { ProfileIdentityCard } from '@/features/settings/components/profile-settings/ProfileIdentityCard'
import { ProfilePreferencesSection } from '@/features/settings/components/profile-settings/ProfilePreferencesSection'
import { ProfileSecuritySection } from '@/features/settings/components/profile-settings/ProfileSecuritySection'
import { ProfileSettingsHeader } from '@/features/settings/components/profile-settings/ProfileSettingsHeader'
import { ProfileStatsGrid } from '@/features/settings/components/profile-settings/ProfileStatsGrid'

type SettingsProfileViewProps = {
  model: SettingsProfileViewModel
  onFormChange: <K extends keyof ProfileFormDraft>(field: K, value: ProfileFormDraft[K]) => void
  onPreferenceToggle: (id: string) => void
  onSave: () => void
  isRefreshing: boolean
}

export function SettingsProfileView({
  model,
  onFormChange,
  onPreferenceToggle,
  onSave,
  isRefreshing,
}: SettingsProfileViewProps) {
  return (
    <div className="mx-auto max-w-[1152px] space-y-6 pb-16 pt-2 xl:space-y-8 xl:pb-20">
      <ProfileSettingsHeader
        title={model.title}
        subtitle={model.subtitle}
        updatedAtLabel={model.updatedAtLabel}
        isRefreshing={isRefreshing}
      />

      <ProfileStatsGrid stats={model.stats} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <ProfileFormSection form={model.form} onChange={onFormChange} />
          <ProfilePreferencesSection preferences={model.preferences} onToggle={onPreferenceToggle} />
          <div className="flex justify-end">
            <Button type="button" size="lg" onClick={onSave} disabled={model.isSaving}>
              {model.isSaving ? 'Đang lưu...' : model.saveButtonLabel}
            </Button>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <ProfileIdentityCard model={model.profileCard} />
          <ProfileSecuritySection checks={model.securityChecks} />
        </aside>
      </section>
    </div>
  )
}
