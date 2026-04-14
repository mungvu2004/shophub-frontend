import { useLocation, useParams } from 'react-router-dom'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
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
        <DataLoadErrorState title="Không thể tải chi tiết đơn hàng." onRetry={() => refetch()} className="p-6" />
      </div>
    )
  }

  const model = buildOrderDetailViewModel(data)

  return <OrderDetailView model={model} isLoading={isLoading} />
}
