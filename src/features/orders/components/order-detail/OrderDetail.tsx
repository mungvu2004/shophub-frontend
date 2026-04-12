import { useLocation, useParams } from 'react-router-dom'

import { OrderDetailView } from '@/features/orders/components/order-detail/OrderDetailView'
import { useOrderDetailData } from '@/features/orders/hooks/useOrderDetailData'
import { buildOrderDetailViewModel } from '@/features/orders/logic/orderDetail.logic'
import type { OrderDetailLocationState } from '@/features/orders/logic/orderDetail.types'

export function OrderDetail() {
  const { id = '' } = useParams()
  const location = useLocation()

  const fallbackState = (location.state as OrderDetailLocationState | null) ?? null

  const { data, isLoading, isError, refetch } = useOrderDetailData({
    id,
    fallbackState,
  })

  if (isError || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30">
        <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <p className="text-sm font-semibold text-rose-700">Không thể tải chi tiết đơn hàng.</p>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            onClick={() => refetch()}
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  const model = buildOrderDetailViewModel(data)

  return <OrderDetailView model={model} isLoading={isLoading} />
}
