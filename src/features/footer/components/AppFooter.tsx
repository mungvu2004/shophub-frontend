import { useMemo } from 'react'

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="text-sm font-semibold text-rose-700">Không tải được footer từ hệ thống.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Thử lại
          </button>
        </div>
      </footer>
    )
  }

  return <AppFooterView model={model} isRefreshing={isFetching} />
}