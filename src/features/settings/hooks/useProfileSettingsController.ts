import { useMemo, useState } from 'react'

import { toast } from '@/components/ui/toast'
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

export function useProfileSettingsController() {
  const { data, isLoading, isFetching, isError, refetch } = useSettingsProfile()
  const { updateProfile, isUpdating } = useUpdateSettingsProfile()

  const [draft, setDraft] = useState<ProfileFormDraft>(emptyDraft)
  const [preferenceDraft, setPreferenceDraft] = useState<Record<string, boolean>>({})

  const [prevData, setPrevData] = useState(data)

  if (data !== prevData) {
    setPrevData(data)
    if (data) {
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
    }
  }

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

  const handleFormChange = <K extends keyof ProfileFormDraft>(field: K, value: ProfileFormDraft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePreferenceToggle = (id: string) => {
    setPreferenceDraft((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSave = async () => {
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
  }

  return {
    model,
    isLoading,
    isRefreshing: isFetching,
    isError,
    refetch,
    handleFormChange,
    handlePreferenceToggle,
    handleSave,
  }
}
