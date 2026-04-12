import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { OrderDetailCustomerCard } from '@/features/orders/components/order-detail/OrderDetailCustomerCard'
import { OrderDetailHistoryTab } from '@/features/orders/components/order-detail/OrderDetailHistoryTab'
import { OrderDetailItemsCard } from '@/features/orders/components/order-detail/OrderDetailItemsCard'
import { OrderDetailReviewsTab } from '@/features/orders/components/order-detail/OrderDetailReviewsTab'
import { OrderDetailTimeline } from '@/features/orders/components/order-detail/OrderDetailTimeline'
import type { OrderDetailTab, OrderDetailViewModel } from '@/features/orders/logic/orderDetail.types'

type OrderDetailViewProps = {
  model: OrderDetailViewModel
  isLoading: boolean
}

function statusToneClass(tone: OrderDetailViewModel['statusTone']) {
  if (tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (tone === 'danger') return 'border-rose-200 bg-rose-50 text-rose-700'
  if (tone === 'processing') return 'border-blue-200 bg-blue-50 text-blue-700'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

function actionButtonClass(tone: 'primary' | 'danger' | 'neutral') {
  if (tone === 'primary') return 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700'
  if (tone === 'danger') return 'border-rose-600 bg-rose-600 text-white hover:bg-rose-700 hover:border-rose-700'
  return 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
}

export function OrderDetailView({ model, isLoading }: OrderDetailViewProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<OrderDetailTab>('detail')

  const tabContent = useMemo(() => {
    if (activeTab === 'history') {
      return <OrderDetailHistoryTab items={model.view.history} />
    }

    if (activeTab === 'review') {
      return <OrderDetailReviewsTab items={model.view.reviews} />
    }

    return (
      <div className="space-y-3">
        <OrderDetailTimeline items={model.view.history} />
        <OrderDetailCustomerCard customerName={model.view.customerName} phone={model.view.phone} address={model.view.address} />
        <OrderDetailItemsCard
          productName={model.view.productName}
          quantity={model.view.quantity}
          subtotalLabel={model.view.subtotalLabel}
          shippingLabel={model.view.shippingLabel}
          voucherLabel={model.view.voucherLabel}
          totalLabel={model.view.totalLabel}
        />
      </div>
    )
  }, [activeTab, model])

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="close" className="absolute inset-0 bg-slate-900/35" onClick={() => navigate(-1)} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] animate-[slideIn_180ms_ease-out] border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          <header className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-700" onClick={() => navigate(-1)}>
                ← Đóng
              </button>
              <h1 className="text-base font-bold text-slate-900">{model.title}</h1>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-700">{model.orderCode}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${model.platformClassName}`}>{model.platformLabel}</span>
              </div>
            </div>
          </header>

          <div className={`border-b px-4 py-2 text-sm font-semibold ${statusToneClass(model.statusTone)}`}>
            {isLoading ? 'Đang tải chi tiết đơn...' : model.statusMessage}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">
            {model.quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${actionButtonClass(action.tone)}`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <nav className="border-b border-slate-100 px-4 pt-3">
            <div className="flex items-center gap-5 text-sm">
              {model.tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`border-b-2 pb-2 ${activeTab === tab.id ? 'border-indigo-600 font-bold text-indigo-600' : 'border-transparent font-medium text-slate-400'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">{tabContent}</div>
        </div>
      </aside>
    </div>
  )
}
