import { ExternalLink, Star } from 'lucide-react'
import type { CompetitorPlatform, TopCompetitor } from '@/features/products/logic/productsCompetitorTracking.types'

const scoreFormatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const platformLabelMap: Record<CompetitorPlatform, string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok Shop',
  lazada: 'Lazada',
}

const platformBadgeClassMap: Record<CompetitorPlatform, string> = {
  shopee: 'bg-orange-50 text-orange-600',
  tiktok_shop: 'bg-slate-100 text-slate-800',
  lazada: 'bg-blue-50 text-blue-600',
}

export function TopCompetitorCard({ competitor }: { competitor: TopCompetitor }) {
  return (
    <article className="group relative rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-bold text-slate-900">{competitor.shopName}</p>
            <ExternalLink className="size-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{competitor.productCount} sản phẩm chung</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${platformBadgeClassMap[competitor.platform]}`}>
          {platformLabelMap[competitor.platform]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1.5">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-black text-slate-700">{scoreFormatter.format(competitor.score)}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 italic">Cập nhật {competitor.lastUpdatedHours}h trước</span>
      </div>
      
      <button 
        type="button" 
        className="absolute inset-0 size-full opacity-0"
        aria-label={`Xem chi tiết shop ${competitor.shopName}`}
      />
    </article>
  )
}
