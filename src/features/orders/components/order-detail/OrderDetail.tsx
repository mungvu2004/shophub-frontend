import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderDetailView } from '@/features/orders/components/order-detail/OrderDetailView'
import { ACTIONS_REQUIRING_CONFIRM } from '@/features/orders/components/order-detail/OrderDetailView'
import { useOrderDetailData } from '@/features/orders/hooks/useOrderDetailData'
import { useOrderDetailQuickActions } from '@/features/orders/hooks/useOrderDetailQuickActions'
import { buildOrderDetailViewModel } from '@/features/orders/logic/orderDetail.logic'
import { useProductData } from '@/features/products/hooks/useProductData'
import type { OrderDetailLocationState } from '@/features/orders/logic/orderDetail.types'

type ConfirmConfig = {
  title: string
  description: string
  confirmText: string
  variant: 'danger' | 'primary' | 'default'
}

function getConfirmConfig(actionId: string, orderCode: string): ConfirmConfig {
  if (actionId === 'confirm-order') {
    return { title: 'Xác nhận đơn hàng', description: `Bạn có chắc chắn muốn xác nhận đơn ${orderCode}?`, confirmText: 'Xác nhận', variant: 'primary' }
  }
  if (actionId === 'ship-order') {
    return { title: 'Giao cho vận chuyển', description: `Xác nhận bàn giao đơn ${orderCode} cho đơn vị vận chuyển?`, confirmText: 'Bàn giao', variant: 'primary' }
  }
  if (actionId === 'cancel-order') {
    return { title: 'Hủy đơn hàng', description: `Bạn có chắc chắn muốn hủy đơn ${orderCode}? Hành động này không thể hoàn tác.`, confirmText: 'Đồng ý, hủy đơn', variant: 'danger' }
  }
  if (actionId === 'refund-order') {
    return { title: 'Tạo yêu cầu hoàn tiền', description: `Xác nhận tạo yêu cầu hoàn tiền cho đơn ${orderCode}?`, confirmText: 'Hoàn tiền', variant: 'danger' }
  }
  return { title: 'Xác nhận', description: 'Bạn có chắc chắn?', confirmText: 'Xác nhận', variant: 'default' }
}

type OrderDetailProps = {
  orderId?: string
  fallbackState?: OrderDetailLocationState | null
  isModalPresentation?: boolean
  onClose?: () => void
}

export function OrderDetail({ orderId, fallbackState: fallbackStateProp, isModalPresentation: isModalPresentationProp, onClose }: OrderDetailProps = {}) {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const id = orderId ?? params.id ?? ''
  const resolvedOrderId = id.startsWith('pending-') ? id.replace('pending-', '') : id

  const [pendingActionId, setPendingActionId] = useState<string | null>(null)

  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'OrderDetailPage',
  })

  const fallbackState = fallbackStateProp ?? (location.state as OrderDetailLocationState | null) ?? null
  const isModalPresentation = isModalPresentationProp ?? Boolean((location.state as { backgroundLocation?: unknown } | null)?.backgroundLocation)

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    if (isModalPresentation) {
      navigate(-1)
      return
    }

    navigate('/orders/all')
  }

  const { data, isLoading, isError, refetch } = useOrderDetailData({
    id: resolvedOrderId,
    fallbackState,
  })

  const { activeActionId, handleQuickAction } = useOrderDetailQuickActions({
    orderId: resolvedOrderId,
    order: data?.order,
    refetchOrder: async () => {
      await refetch()
    },
  })

  if (isLoading && !data) {
    return isModalPresentation ? (
      <div className="fixed inset-0 z-50">
        <button type="button" aria-label="close" className="absolute inset-0 bg-slate-900/35" onClick={handleClose} />
        <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] border-l border-slate-200 bg-white shadow-2xl">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
            </div>
            <div className="border-b px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50">Đang tải chi tiết đơn...</div>
            <div className="space-y-3 border-b border-slate-100 px-4 py-3">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-4/5 rounded-md" />
            </div>
            <div className="flex-1 space-y-3 bg-slate-50 px-4 py-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          </div>
        </aside>
      </div>
    ) : (
      <div className="min-h-screen bg-slate-50 px-4 py-4">
        <div className="mx-auto flex w-full max-w-[1680px] justify-end">
          <aside className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
            <div className="flex h-full flex-col">
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
              </div>
              <div className="border-b px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50">Đang tải chi tiết đơn...</div>
              <div className="space-y-3 border-b border-slate-100 px-4 py-3">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-4/5 rounded-md" />
              </div>
              <div className="flex-1 space-y-3 bg-slate-50 px-4 py-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-36 w-full rounded-xl" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30">
        <DataLoadErrorState title="Không thể tải chi tiết đơn hàng." onRetry={() => refetch()} className="p-6" />
      </div>
    )
  }

  const model = buildOrderDetailViewModel(data)
  const confirmConfig = pendingActionId ? getConfirmConfig(pendingActionId, model.orderCode) : null

  return (
    <>
      <OrderDetailView
        model={model}
        isLoading={isLoading}
        isModalPresentation={isModalPresentation}
        activeActionId={activeActionId}
        onClose={handleClose}
        onQuickAction={(actionId) => void handleQuickAction(actionId)}
        onRequestConfirm={setPendingActionId}
      />
      {confirmConfig && (
        <ConfirmDialog
          open={pendingActionId !== null}
          onOpenChange={(open) => { if (!open) setPendingActionId(null) }}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmText={confirmConfig.confirmText}
          cancelText="Quay lại"
          variant={confirmConfig.variant}
          isConfirming={activeActionId !== null}
          onConfirm={() => {
            if (pendingActionId) void handleQuickAction(pendingActionId)
            setPendingActionId(null)
          }}
        />
      )}
    </>
  )
}
