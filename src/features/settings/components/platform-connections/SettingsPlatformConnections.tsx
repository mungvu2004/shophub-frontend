import { useMemo } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { SettingsPlatformConnectionsView } from '@/features/settings/components/platform-connections/SettingsPlatformConnectionsView'
import { useSettingsPlatformConnections } from '@/features/settings/hooks/useSettingsPlatformConnections'
import { buildSettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.logic'

export function SettingsPlatformConnections() {
  const { data, isLoading, isError, refetch } = useSettingsPlatformConnections()

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildSettingsPlatformConnectionsViewModel(data)
  }, [data])

  if (isLoading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải cấu hình kết nối sàn...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu kết nối sàn." onRetry={() => refetch()} className="rounded-xl" />
  }

  return <SettingsPlatformConnectionsView model={model} />
}
