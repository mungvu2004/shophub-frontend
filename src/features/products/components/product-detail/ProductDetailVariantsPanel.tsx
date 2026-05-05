import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ImageOff, Layers3, Package } from 'lucide-react'

import { formatDateTime, money, platformLabelMap } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductInventoryItem } from '@/features/products/logic/productDetailPage.types'
import type { Product } from '@/types/product.types'

type ProductDetailVariantsPanelProps = {
  product: Product
  inventoryItems: ProductInventoryItem[]
}

const DEFAULT_VISIBLE_VARIANTS = 5

const channelBadgeColors: Record<string, string> = {
  shopee: 'border-orange-200 bg-orange-50 text-orange-700',
  tiktok_shop: 'border-slate-200 bg-slate-100 text-slate-600',
  lazada: 'border-sky-200 bg-sky-50 text-sky-700',
}

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
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <Layers3 className="size-4 text-white" />
          </span>
          <div>
            <h2 className="text-base font-black text-slate-900">Danh sách biến thể</h2>
            <p className="text-xs text-slate-500">{product.variants.length} biến thể · {inventoryItems.reduce((s, i) => s + i.availableQty, 0)} khả dụng</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visibleVariants.map((variant) => {
          const inv = variantInventoryMap[variant.id] ?? { physicalQty: 0, reservedQty: 0, availableQty: 0 }
          const stockPct = inv.physicalQty > 0 ? Math.round((inv.availableQty / inv.physicalQty) * 100) : 0
          const attrs = variant.attributesJson ? Object.entries(variant.attributesJson) : []

          return (
            <div key={variant.id} className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-sm">
              {/* Top row: image + name + status */}
              <div className="flex items-start gap-3">
                {/* Variant image */}
                <div className="shrink-0 h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {variant.mainImageUrl ? (
                    <img src={variant.mainImageUrl} alt={variant.name ?? ''} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageOff className="size-5" />
                    </div>
                  )}
                </div>

                {/* Name + SKU + attrs */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="truncate font-semibold text-slate-900">{variant.name || 'Biến thể mặc định'}</p>
                    <span className={`shrink-0 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      variant.status === 'Active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}>
                      {variant.status === 'Active' ? 'Đang bán' : 'Tạm dừng'}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">{variant.internalSku}</p>
                  {attrs.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {attrs.map(([k, v]) => (
                        <span key={k} className="rounded-lg bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                          {k}: <span className="font-semibold">{v}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Giá bán</p>
                  <p className="mt-0.5 font-bold text-slate-900">{money(variant.salePrice ?? variant.basePrice ?? 0)}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500">Khả dụng</p>
                  <p className="mt-0.5 font-bold text-emerald-700">{inv.availableQty}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Tồn thực</p>
                  <p className="mt-0.5 font-bold text-slate-900">{inv.physicalQty}</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-amber-500">Đang giữ</p>
                  <p className="mt-0.5 font-bold text-amber-700">{inv.reservedQty}</p>
                </div>
              </div>

              {/* Stock bar */}
              {inv.physicalQty > 0 && (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400">Tỷ lệ khả dụng</span>
                    <span className="text-[10px] font-semibold text-slate-600">{stockPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full transition-all ${stockPct > 50 ? 'bg-emerald-500' : stockPct > 20 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{ width: `${Math.min(stockPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Channels + sync */}
              {variant.listings.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {variant.listings.map((listing) => (
                    <span
                      key={listing.id}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${channelBadgeColors[listing.platform] ?? 'border-slate-200 bg-white text-slate-600'}`}
                    >
                      <Package className="size-3" />
                      {platformLabelMap[listing.platform] ?? listing.platform}
                    </span>
                  ))}
                  {variant.listings[0]?.lastSyncedAt && (
                    <span className="ml-auto text-[10px] text-slate-400">
                      Đồng bộ: {formatDateTime(variant.listings[0].lastSyncedAt)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {product.variants.length > DEFAULT_VISIBLE_VARIANTS && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <><ChevronUp className="size-3.5" /> Thu gọn</>
            ) : (
              <><ChevronDown className="size-3.5" /> Xem thêm {product.variants.length - DEFAULT_VISIBLE_VARIANTS} biến thể</>
            )}
          </button>
        </div>
      )}
    </article>
  )
}
