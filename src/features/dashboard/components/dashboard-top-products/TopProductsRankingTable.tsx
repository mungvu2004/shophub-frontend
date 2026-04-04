import { MoreVertical } from 'lucide-react'

import type { DashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsRankingTableProps = {
  rows: DashboardTopProductsViewModel['rankingRows']
}

const platformClassMap = {
  shopee: 'bg-orange-100 text-orange-600',
  lazada: 'bg-indigo-100 text-indigo-700',
  tiktok: 'bg-slate-900 text-white',
}

export function TopProductsRankingTable({ rows }: TopProductsRankingTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e7eeff] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#eef2ff] px-5 py-4">
        <h3 className="text-sm font-bold text-[#111c2d]">Danh sách xếp hạng đầy đủ</h3>
        <button type="button" className="text-sm font-semibold text-[#5b4bff] hover:text-[#4338ca]">
          Tuỳ chỉnh báo cáo
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="bg-[#f8f9ff] text-[10px] uppercase tracking-[0.08em] text-[#64748b]">
              <th className="px-4 py-3 text-left">Hạng</th>
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-center">SKU</th>
              <th className="px-4 py-3 text-center">Sàn</th>
              <th className="px-4 py-3 text-right">Đã bán</th>
              <th className="px-4 py-3 text-right">Doanh thu</th>
              <th className="px-4 py-3 text-right">Giá TB</th>
              <th className="px-4 py-3 text-right">Tỷ lệ hoàn</th>
              <th className="px-4 py-3 text-center">Xu hướng</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#eef2ff]">
                <td className="px-4 py-4 font-mono text-sm font-semibold text-[#334155]">{row.rankLabel}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={row.imageUrl} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
                    <p className="line-clamp-1 text-sm font-semibold text-[#0f172a]">{row.name}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-mono text-[10px] uppercase text-[#64748b]">{row.sku}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${platformClassMap[row.platformTone]}`}>{row.platformLabel}</span>
                </td>
                <td className="px-4 py-4 text-right font-mono text-sm text-[#111c2d]">{row.soldLabel}</td>
                <td className="px-4 py-4 text-right font-mono text-sm font-bold text-[#4338ca]">{row.revenueLabel}</td>
                <td className="px-4 py-4 text-right font-mono text-sm text-[#111c2d]">{row.avgPriceLabel}</td>
                <td className="px-4 py-4 text-right font-mono text-sm text-[#111c2d]">{row.returnRateLabel}</td>
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-end gap-1 rounded-md bg-[#eef2ff] px-2 py-1">
                    {row.trendBars.map((bar, index) => (
                      <span
                        key={`${row.id}-bar-${index}`}
                        className={`w-2 rounded-sm ${row.trendTone === 'up' ? 'bg-[#6366f1]' : 'bg-[#f87171]'}`}
                        style={{ height: `${bar}px` }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button type="button" className="rounded-md p-1 text-[#64748b] hover:bg-[#f1f5f9]">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-[#eef2ff] py-3 text-center text-xs font-semibold text-[#334155]">Xem thêm 15 sản phẩm khác</footer>
    </section>
  )
}
