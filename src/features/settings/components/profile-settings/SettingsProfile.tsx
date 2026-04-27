import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { SettingsProfileView } from '@/features/settings/components/profile-settings/SettingsProfileView'
import { useProfileSettingsController } from '@/features/settings/hooks/useProfileSettingsController'

export function SettingsProfile() {
  const {
    model,
    isLoading,
    isRefreshing,
    isError,
    refetch,
    handleFormChange,
    handlePreferenceToggle,
    handleSave,
  } = useProfileSettingsController()

  if (isLoading && !model) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu profile settings...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu profile settings." onRetry={() => refetch()} className="rounded-xl" />
  }

  return (
    <SettingsProfileView
      model={model}
      isRefreshing={isRefreshing}
      onFormChange={handleFormChange}
      onPreferenceToggle={handlePreferenceToggle}
      onSave={handleSave}
    />
  )
}
