import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

import type { RevenueChartsPlatformId, RevenueChartsWeeklyRowViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueWeeklyComparisonTableProps = {
  title: string
  rows: RevenueChartsWeeklyRowViewModel[]
  selectedPlatform: RevenueChartsPlatformId
}

export function RevenueWeeklyComparisonTable({ title, rows, selectedPlatform }: RevenueWeeklyComparisonTableProps) {
  const showShopee = selectedPlatform === 'all' || selectedPlatform === 'shopee'
  const showLazada = selectedPlatform === 'all' || selectedPlatform === 'lazada'
  const showTiktok = selectedPlatform === 'all' || selectedPlatform === 'tiktok_shop'

  return (
    <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
      <header className="flex items-center justify-between px-6 py-5">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <button type="button" className="text-xs font-bold uppercase tracking-[0.6px] text-indigo-700">
          Xem tất cả tuần
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-indigo-50/60 text-[11px] uppercase tracking-[1px] text-slate-500">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Thời gian</th>
              {showShopee && <th className="px-6 py-4 text-left font-bold">Shopee</th>}
              {showLazada && <th className="px-6 py-4 text-left font-bold">Lazada</th>}
              {showTiktok && <th className="px-6 py-4 text-left font-bold">TikTok Shop</th>}
              <th className="px-6 py-4 text-left font-bold">Tăng trưởng</th>
              <th className="px-6 py-4 text-right font-bold">Tổng doanh thu</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-indigo-100">
                <td className="px-6 py-4 font-semibold text-slate-900">{row.weekLabel}</td>
                {showShopee && <td className="px-6 py-4 font-medium text-slate-600">{row.shopeeLabel}</td>}
                {showLazada && <td className="px-6 py-4 font-medium text-slate-600">{row.lazadaLabel}</td>}
                {showTiktok && <td className="px-6 py-4 font-medium text-slate-600">{row.tiktokShopLabel}</td>}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 font-bold ${row.growthTone === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {row.growthTone === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {row.growthLabel}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">{row.totalLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

