import { useMemo, useState } from 'react'
import { Layers3, Store } from 'lucide-react'

import { formatDateTime, money, platformLabelMap } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductInventoryItem } from '@/features/products/logic/productDetailPage.types'
import type { Product } from '@/types/product.types'

type ProductDetailVariantsPanelProps = {
  product: Product
  inventoryItems: ProductInventoryItem[]
}

const DEFAULT_VISIBLE_VARIANTS = 3

export function ProductDetailVariantsPanel({ product, inventoryItems }: ProductDetailVariantsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const variantInventoryMap = useMemo(() => {
    return inventoryItems.reduce<Record<string, { physicalQty: number; reservedQty: number; availableQty: number }>>((acc, item) => {
      const current = acc[item.variantId] ?? { physicalQty: 0, reservedQty: 0, availableQty: 0 }
      current.physicalQty += item.physicalQty
      current.reservedQty += item.reservedQty
      current.availableQty += item.availableQty
      acc[item.variantId] = current
      return acc
    }, {})
  }, [inventoryItems])

  const visibleVariants = isExpanded ? product.variants : product.variants.slice(0, DEFAULT_VISIBLE_VARIANTS)

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-900">Danh sách biến thể</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          <Layers3 className="size-3.5" />
          {product.variants.length} biến thể
        </span>
      </div>

      <div className="space-y-2.5">
        {visibleVariants.map((variant) => {
          const variantInventory = variantInventoryMap[variant.id] ?? { physicalQty: 0, reservedQty: 0, availableQty: 0 }

          return (
            <div key={variant.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{variant.name || 'Biến thể mặc định'}</p>
                  <p className="truncate font-mono text-xs uppercase text-slate-500">{variant.internalSku}</p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    variant.status === 'Active'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}
                >
                  {variant.status === 'Active' ? 'Đang bán' : 'Tạm dừng'}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Giá bán</p>
                  <p className="mt-0.5 font-semibold text-slate-900">{money(variant.salePrice ?? variant.basePrice ?? 0)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Khả dụng</p>
                  <p className="mt-0.5 font-semibold text-emerald-700">{variantInventory.availableQty}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Tồn thực</p>
                  <p className="mt-0.5 font-semibold text-slate-900">{variantInventory.physicalQty}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Đã giữ</p>
                  <p className="mt-0.5 font-semibold text-amber-700">{variantInventory.reservedQty}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-600">
                  <p className="text-[11px] uppercase tracking-[0.5px] text-slate-500">Đồng bộ</p>
                  <p className="mt-0.5 font-semibold text-slate-900">{formatDateTime(variant.listings[0]?.lastSyncedAt)}</p>
                </div>
              </div>

              {variant.listings.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {variant.listings.slice(0, 3).map((listing) => (
                    <span
                      key={listing.id}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                    >
                      <Store className="size-3" />
                      {platformLabelMap[listing.platform] ?? listing.platform}
                    </span>
                  ))}
                  {variant.listings.length > 3 ? (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">
                      +{variant.listings.length - 3} kênh
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {product.variants.length > DEFAULT_VISIBLE_VARIANTS ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'Thu gọn biến thể' : `Xem thêm ${product.variants.length - DEFAULT_VISIBLE_VARIANTS} biến thể`}
          </button>
        </div>
      ) : null}
    </article>
  )
}
