import { Filter, Search, TrendingDown, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  CompetitorPlatform,
  CompetitorPriceRow,
  CompetitorTrackingViewModel,
} from '@/features/products/logic/productsCompetitorTracking.types'

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const platformLabelMap: Record<CompetitorPlatform, string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok Shop',
  lazada: 'Lazada',
}

const platformBadgeClassMap: Record<CompetitorPlatform, string> = {
  shopee: 'bg-orange-100 text-orange-700',
  tiktok_shop: 'bg-slate-900 text-white',
  lazada: 'bg-blue-100 text-blue-700',
}

const rankBadgeClass = (rank: number, total: number) => {
  const ratio = rank / Math.max(total, 1)

  if (ratio <= 0.34) {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (ratio <= 0.67) {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-rose-100 text-rose-700'
}

const trendIndicator = (trend: CompetitorPriceRow['trend']) => {
  if (trend === 'up') {
    return <TrendingUp className="h-4 w-4 text-rose-500" aria-hidden />
  }

  if (trend === 'down') {
    return <TrendingDown className="h-4 w-4 text-emerald-500" aria-hidden />
  }

  return <span className="inline-block h-[2px] w-6 rounded bg-slate-300" aria-hidden />
}

type CompetitorComparisonTableProps = {
  model: CompetitorTrackingViewModel
}

export function CompetitorComparisonTable({ model }: CompetitorComparisonTableProps) {
  return (
    <article className="xl:col-span-2 rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-50 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">So sánh giá hiện tại</h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={model.searchValue}
              onChange={(event) => model.onSearchChange(event.target.value)}
              placeholder="Tìm sản phẩm"
              className="h-9 w-56 pl-9"
            />
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-500">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[740px] text-left">
          <thead className="bg-indigo-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-4 py-4">Giá của bạn</th>
              <th className="px-4 py-4">Giá TB đối thủ</th>
              <th className="px-4 py-4">Thấp nhất</th>
              <th className="px-4 py-4">Vị trí</th>
              <th className="px-4 py-4">Thay đổi 24h</th>
              <th className="px-6 py-4 text-right">Nền tảng</th>
            </tr>
          </thead>
          <tbody>
            {model.isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : model.filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                  Không có sản phẩm phù hợp
                </td>
              </tr>
            ) : (
              model.filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-t border-indigo-50/60 text-sm hover:bg-indigo-50/40"
                  onClick={() => model.onOpenProductDetail(row.productId)}
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 hover:text-indigo-700">{row.productName}</td>
                  <td className="px-4 py-4 font-mono text-slate-800">{currencyFormatter.format(row.yourPrice)}</td>
                  <td className="px-4 py-4 font-mono text-slate-500">{currencyFormatter.format(row.marketAveragePrice)}</td>
                  <td className="px-4 py-4 font-mono text-rose-600">{currencyFormatter.format(row.lowestMarketPrice)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rankBadgeClass(row.rank, row.totalCompetitors)}`}>
                      #{row.rank}/{row.totalCompetitors}
                    </span>
                  </td>
                  <td className="px-4 py-4">{trendIndicator(row.trend)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${platformBadgeClassMap[row.platform]}`}>
                      {platformLabelMap[row.platform]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  )
}
