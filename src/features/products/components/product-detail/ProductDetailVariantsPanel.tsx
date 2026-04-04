import { Layers3, Store } from 'lucide-react'

import { formatDateTime, money, platformLabelMap } from '@/features/products/components/product-detail/productDetail.utils'
import type { Product } from '@/types/product.types'

type ProductDetailVariantsPanelProps = {
  product: Product
}

export function ProductDetailVariantsPanel({ product }: ProductDetailVariantsPanelProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-900">Danh sach bien the</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          <Layers3 className="size-3.5" />
          {product.variants.length} bien the
        </span>
      </div>

      <div className="space-y-2.5">
        {product.variants.map((variant) => (
          <div key={variant.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{variant.name || 'Bien the mac dinh'}</p>
                <p className="truncate font-mono text-xs uppercase text-slate-500">{variant.internalSku}</p>
              </div>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                  variant.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {variant.status === 'Active' ? 'Dang ban' : 'Tam dung'}
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Gia ban</p>
                <p className="mt-0.5 font-semibold text-slate-900">{money(variant.salePrice ?? variant.basePrice ?? 0)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Listings</p>
                <p className="mt-0.5 font-semibold text-slate-900">{variant.listings.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Dong bo gan nhat</p>
                <p className="mt-0.5 font-semibold text-slate-900">{formatDateTime(variant.listings[0]?.lastSyncedAt)}</p>
              </div>
            </div>

            {variant.listings.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {variant.listings.map((listing) => (
                  <span
                    key={listing.id}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                  >
                    <Store className="size-3" />
                    {platformLabelMap[listing.platform] ?? listing.platform}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  )
}
