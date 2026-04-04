import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product.types'

interface ProductsCardListProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onView?: (product: Product) => void
}

const calculateCardMetrics = (productId: string) => {
  const seed = Number((productId.match(/\d+/)?.[0] ?? '1'))

  return {
    stock: (seed * 7) % 180 + 20,
    sold: (seed * 11) % 1100 + 20,
    shopee: (seed * 3) % 100,
    tiktok: (seed * 5) % 100,
    lazada: (seed * 9) % 100,
  }
}

const platformLabel: Record<string, string> = {
  shopee: 'SHOPEE',
  tiktok_shop: 'TIKTOK',
  lazada: 'LAZADA',
}

const platformBadgeClass: Record<string, string> = {
  shopee: 'bg-orange-500',
  tiktok_shop: 'bg-black',
  lazada: 'bg-blue-600',
}

export function ProductsCardList({ products, isLoading, onEdit, onView }: ProductsCardListProps) {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-[410px] rounded-2xl border border-slate-100 bg-slate-50 animate-pulse" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-slate-100 bg-white text-slate-500">
        Không có sản phẩm nào
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const variants = product.variants ?? []
        const primaryVariant = variants[0]
        const firstListing = primaryVariant?.listings?.[0]
        const metrics = calculateCardMetrics(product.id)
        const platforms = Array.from(
          new Set(product.variants?.flatMap((item) => item.listings?.map((listing) => listing.platform) ?? []) ?? []),
        ).slice(0, 2)

        const statusLabel = product.status === 'Active' ? 'Đang bán' : product.status === 'Inactive' ? 'Tạm dừng' : 'Hết hàng'
        const statusClass =
          product.status === 'Active'
            ? 'bg-emerald-500 text-white'
            : product.status === 'Inactive'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-500 text-white'

        return (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md cursor-pointer"
            onClick={() => onView?.(product)}
          >
            <div className="relative h-40 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${platformBadgeClass[platform] ?? 'bg-slate-700'}`}
                  >
                    {platformLabel[platform] ?? platform.toUpperCase()}
                  </span>
                ))}
                {platforms.length === 0 && (
                  <span className="rounded-md bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-white">
                    {platformLabel[firstListing?.platform ?? 'shopee'] ?? 'SHOP'}
                  </span>
                )}
              </div>
              <span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass}`}>
                {statusLabel}
              </span>

              {primaryVariant?.mainImageUrl ? (
                <img src={primaryVariant.mainImageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h3 className="line-clamp-2 text-2xl font-bold leading-tight text-slate-800">{product.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">SKU: {primaryVariant?.internalSku ?? 'N/A'}</p>
              </div>

              <p className="font-mono text-3xl font-bold text-indigo-600">
                {(primaryVariant?.salePrice ?? 0).toLocaleString('vi-VN')} ₫
              </p>

              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold text-emerald-600">• Tồn: {metrics.stock} units</p>
                <p className="text-slate-400">Đã bán: {metrics.sold}</p>
              </div>

              <div className="grid grid-cols-3 border-t border-slate-100 pt-2 text-center text-sm text-slate-400">
                <p>Shopee: {metrics.shopee}</p>
                <p>TikTok: {metrics.tiktok}</p>
                <p>Lazada: {metrics.lazada}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={(event) => {
                    event.stopPropagation()
                    onEdit?.(product)
                  }}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-indigo-200 text-indigo-600"
                  onClick={(event) => {
                    event.stopPropagation()
                    onView?.(product)
                  }}
                >
                  Xem
                </Button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
