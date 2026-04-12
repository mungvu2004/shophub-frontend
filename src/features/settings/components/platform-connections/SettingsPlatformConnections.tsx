import { useMemo } from 'react'

import { SettingsPlatformConnectionsView } from '@/features/settings/components/platform-connections/SettingsPlatformConnectionsView'
import { useSettingsPlatformConnections } from '@/features/settings/hooks/useSettingsPlatformConnections'
import { buildSettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.logic'

export function SettingsPlatformConnections() {
  const { data, isLoading, isError } = useSettingsPlatformConnections()

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
    return <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-sm font-semibold text-rose-600">Không tải được dữ liệu kết nối sàn.</div>
  }

  return <SettingsPlatformConnectionsView model={model} />
}
