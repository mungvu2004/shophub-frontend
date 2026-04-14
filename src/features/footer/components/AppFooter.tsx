import { useMemo } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { AppFooterView } from '@/features/footer/components/app-footer/AppFooterView'
import { useFooterSnapshot } from '@/features/footer/hooks/useFooterSnapshot'
import { buildFooterViewModel } from '@/features/footer/logic/footer.logic'

export function AppFooter() {
  const { data, isLoading, isError, isFetching, refetch } = useFooterSnapshot()

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildFooterViewModel(data)
  }, [data])

  if (isLoading && !model) {
    return (
      <footer className="mt-10 border-t border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 lg:px-8">
        Đang tải thông tin footer...
      </footer>
    )
  }

  if (isError || !model) {
    return (
      <footer className="mt-10 border-t border-rose-200 bg-rose-50 px-4 py-6 lg:px-8">
        <DataLoadErrorState
          title="Không tải được footer từ hệ thống."
          onRetry={() => refetch()}
          className="mx-auto max-w-7xl rounded-none border-0 bg-transparent p-0"
        />
      </footer>
    )
  }

  return <AppFooterView model={model} isRefreshing={isFetching} />
}