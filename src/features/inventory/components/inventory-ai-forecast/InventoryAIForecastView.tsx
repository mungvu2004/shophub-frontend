import { AlertTriangle, Bot, CalendarClock, Circle, FileDown, Lightbulb, PackagePlus, RefreshCcw, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  ForecastTableFilter,
  InventoryAIForecastTableRowViewModel,
  InventoryAIForecastViewModel,
} from '@/features/inventory/logic/inventoryAIForecast.types'

type InventoryAIForecastViewProps = {
  model: InventoryAIForecastViewModel
  selectedFilter: ForecastTableFilter
  filteredRows: InventoryAIForecastTableRowViewModel[]
  onFilterChange: (filter: ForecastTableFilter) => void
  onOpenDetail: (sku: string) => void
}

const statusClass: Record<InventoryAIForecastTableRowViewModel['status'], string> = {
  urgent: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  healthy: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<InventoryAIForecastTableRowViewModel['status'], string> = {
  urgent: '3 ngày',
  warning: '7-14 ngày',
  healthy: '32 ngày',
}

export function InventoryAIForecastView({
  model,
  selectedFilter,
  filteredRows,
  onFilterChange,
  onOpenDetail,
}: InventoryAIForecastViewProps) {
  return (
    <div className="space-y-4 pb-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-[26px] font-bold text-indigo-700">
            <span aria-hidden>✨</span>
            <span>{model.title}</span>
          </h1>

          <p className="text-sm text-slate-600">
            {model.modelDescription} <span className="font-semibold text-indigo-600">{model.modelAccuracyLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-indigo-200 text-indigo-700">
            <RefreshCcw className="h-4 w-4" />
            Chạy lại dự báo
          </Button>
          <Button variant="ghost" className="h-10 text-slate-600">
            <FileDown className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-6 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
          <span className="font-medium">{model.modelStatusText}</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <p>Dữ liệu đầu vào: <span className="font-semibold text-indigo-600">{model.modelInputLabel}</span></p>
          <p>Lần chạy cuối: <span className="font-semibold text-slate-800">{model.modelRunLabel}</span></p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {model.urgentTitle}
        </h2>

        <div className="space-y-3">
          {model.urgentCards.map((card) => (
            <article
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetail(card.sku)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenDetail(card.sku)
                }
              }}
              className="cursor-pointer rounded-xl border border-red-100 border-l-4 border-l-red-700 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{card.productName}</h3>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                      {card.confidenceLabel} tin cậy
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-slate-400">{card.sku}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Tồn kho hiện tại</p>
                  <p className="font-mono text-2xl font-bold text-red-700">{card.currentStockLabel}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Thời gian còn lại</p>
                  <p className="text-xl font-bold text-red-700">{card.stockoutLabel}</p>
                </div>

                <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Gợi ý nhập</p>
                  <p className="mt-1 font-mono text-xl font-bold text-indigo-700">{card.suggestedInboundLabel}</p>
                </div>

                <Button className="h-10 bg-indigo-700 px-6 hover:bg-indigo-600">
                  <PackagePlus className="h-4 w-4" />
                  Tạo đơn nhập kho
                </Button>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-800">Lý do dự báo:</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {card.reasons.map((reason) => (
                    <div key={reason} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-amber-600">{model.watchTitle}</h2>

        <div className="grid gap-3 md:grid-cols-3">
          {model.watchCards.map((card) => (
            <article
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetail(card.sku)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenDetail(card.sku)
                }
              }}
              className="cursor-pointer rounded-xl border border-amber-200 border-l-4 border-l-amber-400 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{card.productName}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-slate-400">{card.sku}</p>

              <dl className="mt-3 space-y-1 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Tồn hiện tại:</dt>
                  <dd className="font-semibold">{card.currentStockLabel}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Dự báo:</dt>
                  <dd className="font-semibold text-amber-700">{card.forecastLabel}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Gợi ý nhập:</dt>
                  <dd className="font-semibold">{card.suggestedInboundLabel}</dd>
                </div>
              </dl>

              <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                Độ tin cậy {card.confidenceLabel}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Tất cả dự báo</h2>

          <div className="flex flex-wrap items-center gap-2">
            {model.tabs.map((tab) => {
              const isActive = tab.id === selectedFilter

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onFilterChange(tab.id)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-semibold transition',
                    isActive
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7f8ff] text-xs font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-3 text-left">SKU</th>
                <th className="px-3 py-3 text-left">Tên sản phẩm</th>
                <th className="px-3 py-3 text-right">T.l hiện tại</th>
                <th className="px-3 py-3 text-right">Bán TB/ngày</th>
                <th className="px-3 py-3 text-center">Dự báo</th>
                <th className="px-3 py-3 text-right">Nhập đề xuất</th>
                <th className="px-3 py-3 text-center">Độ tin cậy</th>
                <th className="px-3 py-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-t border-slate-100"
                  onClick={() => onOpenDetail(row.sku)}
                >
                  <td className="px-3 py-3 font-mono text-xs uppercase text-slate-400">{row.sku}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{row.productName}</td>
                  <td className="px-3 py-3 text-right text-slate-700">{row.currentStockLabel}</td>
                  <td className="px-3 py-3 text-right text-slate-700">{row.avgDailySalesLabel}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass[row.status]}`}>
                      {statusLabel[row.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-indigo-600">{row.suggestedInboundLabel}</td>
                  <td className="px-3 py-3 text-center text-slate-700">{row.confidenceLabel}</td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-500"
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail(row.sku)
                      }}
                    >
                      <ShoppingCart className="mx-auto h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{model.totalRowsLabel}</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              Cập nhật: {model.generatedAtLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-indigo-600">
              <Bot className="h-3.5 w-3.5" />
              Mô hình LSTM phân tích theo múi giờ Việt Nam
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 text-indigo-600" />
          Mô hình có thể dao động nhẹ vào các ngày cao điểm chiến dịch. Vui lòng kết hợp thêm dữ liệu campaign để ra quyết định cuối cùng.
        </p>
      </section>
    </div>
  )
}
