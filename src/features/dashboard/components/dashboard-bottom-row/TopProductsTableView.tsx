import { ExternalLink } from 'lucide-react'

import type { TopProductTableRow, TopProductsTableViewModel } from '@/features/dashboard/logic/topProductsTable.types'

type TopProductsTableViewProps = {
  model: TopProductsTableViewModel
  onViewAll?: () => void
  onProductClick?: (productId: string) => void
}

const platformBadgeClass: Record<TopProductTableRow['platform'], string> = {
  shopee: 'bg-orange-100 text-orange-600',
  tiktok: 'bg-slate-900 text-white',
  lazada: 'bg-indigo-100 text-indigo-700',
}

const platformLabel: Record<TopProductTableRow['platform'], string> = {
  shopee: 'SHOPEE',
  tiktok: 'TIKTOK',
  lazada: 'LAZADA',
}

function ProductAvatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="h-10 w-10 rounded-lg object-cover" />
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export function TopProductsTableView({ model, onViewAll, onProductClick }: TopProductsTableViewProps) {
  return (
    <article className="h-[580px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#f0f3ff] px-6 py-6">
        <h3 className="text-lg font-bold leading-7 text-slate-900">{model.title}</h3>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-sm font-bold text-indigo-700 hover:text-indigo-600 transition-colors"
        >
          <span>{model.ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-[#f0f3ff4d]">
              <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.05em] text-slate-400">RANK</th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.05em] text-slate-400">TÊN SẢN PHẨM</th>
              <th className="px-6 py-4 text-center text-xs font-bold tracking-[0.05em] text-slate-400">SÀN</th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-[0.05em] text-slate-400">ĐÃ BÁN</th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-[0.05em] text-slate-400">DOANH THU</th>
            </tr>
          </thead>

          <tbody>
            {model.rows.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onProductClick?.(row.id)}
                className={`${
                  index === 0 ? '' : 'border-t border-[#f0f3ff]'
                } cursor-pointer transition-colors hover:bg-slate-50`}
              >
                <td className={`px-6 py-6 text-sm font-bold ${index === 0 ? 'text-indigo-700' : 'text-slate-400'}`}>{row.rank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ProductAvatar name={row.name} imageUrl={row.imageUrl} />
                    <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">{row.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-black uppercase ${platformBadgeClass[row.platform]}`}>
                    {platformLabel[row.platform]}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">{row.soldInMonthLabel}</td>
                <td className="px-6 py-4 text-right font-mono text-sm font-bold text-slate-900">{row.revenueLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
