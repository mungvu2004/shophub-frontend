import { useEffect, useMemo, useState } from 'react'

import { toast } from '@/components/ui/toast'
import { SettingsProfileView } from '@/features/settings/components/profile-settings/SettingsProfileView'
import { useSettingsProfile, useUpdateSettingsProfile } from '@/features/settings/hooks/useSettingsProfile'
import { buildSettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.logic'
import type { ProfileFormDraft } from '@/features/settings/logic/settingsProfile.types'

const emptyDraft: ProfileFormDraft = {
  fullName: '',
  phone: '',
  jobTitle: '',
  timezone: '',
  bio: '',
}

export function SettingsProfile() {
  const { data, isLoading, isFetching, isError, refetch } = useSettingsProfile()
  const { updateProfile, isUpdating } = useUpdateSettingsProfile()

  const [draft, setDraft] = useState<ProfileFormDraft>(emptyDraft)
  const [preferenceDraft, setPreferenceDraft] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!data) {
      return
    }

    setDraft({
      fullName: data.identity.fullName,
      phone: data.identity.phone,
      jobTitle: data.identity.jobTitle,
      timezone: data.identity.timezone,
      bio: data.identity.bio,
    })

    setPreferenceDraft(
      data.preferences.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = item.enabled
        return acc
      }, {}),
    )
  }, [data])

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildSettingsProfileViewModel({
      data,
      draft,
      preferenceDraft,
      isSaving: isUpdating,
    })
  }, [data, draft, preferenceDraft, isUpdating])

  if (isLoading && !model) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu profile settings...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu profile settings.</p>
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
    <SettingsProfileView
      model={model}
      isRefreshing={isFetching}
      onFormChange={(field, value) => {
        setDraft((prev) => ({
          ...prev,
          [field]: value,
        }))
      }}
      onPreferenceToggle={(id) => {
        setPreferenceDraft((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }}
      onSave={async () => {
        try {
          await updateProfile({
            identity: {
              fullName: draft.fullName,
              phone: draft.phone,
              jobTitle: draft.jobTitle,
              timezone: draft.timezone,
              bio: draft.bio,
            },
            preferences: Object.entries(preferenceDraft).map(([id, enabled]) => ({
              id,
              enabled,
            })),
          })

          toast.success('Đã lưu thay đổi hồ sơ cá nhân.')
        } catch {
          toast.error('Không thể lưu hồ sơ. Vui lòng thử lại.')
        }
      }}
    />
  )
}
