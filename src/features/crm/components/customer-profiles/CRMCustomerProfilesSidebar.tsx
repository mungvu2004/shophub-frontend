import { Card } from '@/components/ui/card'

type CRMCustomerProfilesSidebarProps = {
  selectedCustomer: {
    insight: {
      title: string
      confidenceLabel: string
      description: string
      favoriteProductLabel: string
      favoriteChannelLabel: string
      churnRiskLabel: string
      churnRiskPercent: number
    }
    rfm: Array<{
      label: string
      value: string
      progressPercent: number
    }>
    notes: Array<{
      id: string
      content: string
      createdAtLabel: string
      authorLabel: string
    }>
    reviews: Array<{
      id: string
      sourceLabel: string
      rating: number
      content: string
      productName: string
      sentimentLabel: string
    }>
  } | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={`star-${index}`}>{index < rating ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

export function CRMCustomerProfilesSidebar({ selectedCustomer }: CRMCustomerProfilesSidebarProps) {
  if (!selectedCustomer) return null

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-[12px] border-0 bg-gradient-to-br from-[#4f46e5] to-[#312e81] p-0 text-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)]">
        <div className="p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">✦</span>
              <div className="text-[16px] font-semibold">{selectedCustomer.insight.title}</div>
            </div>
            <div className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              {selectedCustomer.insight.confidenceLabel}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-200">Đặc điểm phân khúc</div>
              <p className="mt-2 text-sm leading-7 text-indigo-50">{selectedCustomer.insight.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-200">Ưa thích nhất</div>
                <div className="mt-1 text-sm font-semibold text-white">{selectedCustomer.insight.favoriteProductLabel}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-200">Kênh ưu tiên</div>
                <div className="mt-1 text-sm font-semibold text-white">{selectedCustomer.insight.favoriteChannelLabel}</div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-indigo-200">
                <span>Rủi ro rời bỏ (Churn Risk)</span>
                <span>{selectedCustomer.insight.churnRiskLabel}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${selectedCustomer.insight.churnRiskPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[12px] border-0 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="text-base font-semibold text-slate-900">RFM Score</div>
        <div className="mt-4 space-y-4">
          {selectedCustomer.rfm.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{metric.label}</span>
                <span>{metric.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: `${metric.progressPercent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[12px] border-0 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="text-base font-semibold text-slate-900">Ghi chú nội bộ</div>
        <div className="mt-4 space-y-3">
          {selectedCustomer.notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {note.content}
              <div className="mt-2 text-[10px] font-medium text-slate-400">{note.createdAtLabel}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[12px] border-0 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="text-base font-semibold text-slate-900">Đánh giá đã bỏ lại</div>
        <div className="mt-4 space-y-4">
          {selectedCustomer.reviews.map((review) => (
            <div key={review.id} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">{review.productName}</div>
                <div className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                  {review.sentimentLabel}
                </div>
              </div>
              <StarRating rating={review.rating} />
              <div className="text-sm leading-6 text-slate-600">{review.content}</div>
              <div className="text-[10px] font-medium text-slate-400">{review.sourceLabel}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
