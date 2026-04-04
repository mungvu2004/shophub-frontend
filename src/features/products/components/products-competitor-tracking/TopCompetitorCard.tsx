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
  shopee: 'bg-orange-100 text-orange-700',
  tiktok_shop: 'bg-slate-900 text-white',
  lazada: 'bg-blue-100 text-blue-700',
}

export function TopCompetitorCard({ competitor }: { competitor: TopCompetitor }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-slate-900">{competitor.shopName}</p>
          <p className="mt-0.5 text-sm text-slate-500">{competitor.productCount} sản phẩm</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${platformBadgeClassMap[competitor.platform]}`}>
          {platformLabelMap[competitor.platform]}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-amber-500">{scoreFormatter.format(competitor.score)}</span>
        <span className="text-slate-500">{competitor.lastUpdatedHours} giờ trước</span>
      </div>
      <button type="button" className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        Xem chi tiết
      </button>
    </article>
  )
}
