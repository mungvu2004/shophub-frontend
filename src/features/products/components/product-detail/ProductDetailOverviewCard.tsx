import type { Product } from '@/types/product.types'

import { formatDateTime, getProductChannels, money, platformLabelMap } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductDetailStats } from '@/features/products/logic/productDetailPage.types'

type ProductDetailOverviewCardProps = {
  product: Product
  stats: ProductDetailStats
}

export function ProductDetailOverviewCard({ product, stats }: ProductDetailOverviewCardProps) {
  const firstVariant = product.variants[0]
  const channels = getProductChannels(product)

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {firstVariant?.mainImageUrl ? (
        <img src={firstVariant.mainImageUrl} alt={product.name} className="h-64 w-full object-cover md:h-80" />
      ) : (
        <div className="grid h-64 place-items-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-100 text-sm font-semibold text-slate-400 md:h-80">
          Không có ảnh sản phẩm
        </div>
      )}

      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.5px] text-slate-500">Thông tin chung</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              <span>Thương hiệu</span>
              <span className="font-semibold text-slate-900">{product.brand || '--'}</span>
            </p>
            <p className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              <span>Nguồn tạo</span>
              <span className="font-semibold text-slate-900">{product.source}</span>
            </p>
            <p className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
              <span>Ngày tạo</span>
              <span className="font-semibold text-slate-900">{formatDateTime(product.createdAt)}</span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.5px] text-slate-500">Giá bán</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Khoảng giá</p>
              <p className="mt-1 text-base font-bold text-slate-900">{money(stats.minPrice)} - {money(stats.maxPrice)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Giá trung bình</p>
              <p className="mt-1 text-base font-bold text-indigo-700">{money(stats.avgPrice)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.5px] text-slate-500">Kênh phân phối</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {channels.length > 0 ? (
              channels.map((channel) => (
                <span
                  key={channel}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {platformLabelMap[channel] ?? channel}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">Chưa có mapping kênh</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
