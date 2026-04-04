import type { RevenueSummaryReportViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'

type RevenueTopProductsSectionProps = {
  topProducts: RevenueSummaryReportViewModel['topProducts']
  profitMomentum: RevenueSummaryReportViewModel['profitMomentum']
  profitMomentumMax: number
}

export function RevenueTopProductsSection({
  topProducts,
  profitMomentum,
  profitMomentumMax,
}: RevenueTopProductsSectionProps) {
  const maxValue = Math.max(1, profitMomentumMax)

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Doanh thu theo sản phẩm - Top 15</h3>
          <button type="button" className="text-xs font-semibold text-indigo-700 hover:underline">Chi tiết</button>
        </div>

        <div className="space-y-3">
          {topProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-[30px_1fr_auto] items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">{product.rank}</span>
              <div className="h-8 overflow-hidden rounded-full bg-indigo-100">
                <div
                  className="flex h-full items-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 text-xs font-semibold text-white"
                  style={{ width: `${Math.max(product.ratioPercent, 20)}%` }}
                >
                  {product.name}
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700">{product.valueLabel}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Dòng chảy lợi nhuận</h3>

        <div className="rounded-xl bg-slate-50 px-3 pb-2 pt-5">
          <div className="grid h-44 grid-cols-4 items-end gap-4">
            {profitMomentum.map((item) => {
              const grossHeight = Math.max(14, Math.round((item.gross / maxValue) * 112))
              const netHeight = Math.max(10, Math.round((item.net / maxValue) * 96))
              const driftHeight = Math.max(6, Math.round(Math.abs(item.gross - item.net) / maxValue * 58))

              return (
                <div key={item.id} className="flex flex-col items-center gap-2">
                  <div className="relative flex h-32 w-full items-end justify-center">
                    <div className="absolute bottom-0 w-7 rounded-t-md bg-indigo-300" style={{ height: `${grossHeight}px` }} />
                    <div className="absolute w-7 rounded-t-md bg-red-700" style={{ bottom: `${Math.max(10, netHeight - 4)}px`, height: `${driftHeight}px` }} />
                  </div>

                  <div className="space-y-0.5 text-center">
                    <p className="text-[10px] font-semibold text-slate-500">{item.label}</p>
                    <p className={item.deltaPercent >= 0 ? 'text-[10px] font-semibold text-emerald-600' : 'text-[10px] font-semibold text-rose-600'}>
                      {item.deltaPercent >= 0 ? '+' : ''}
                      {item.deltaPercent}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-indigo-300" />
              Tổng (doanh)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-red-700" />
              Giảm (ẩn)
            </span>
          </div>
        </div>
      </article>
    </section>
  )
}
