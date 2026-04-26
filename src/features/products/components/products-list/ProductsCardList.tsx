import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, Pencil } from 'lucide-react'
import type { Product } from '@/types/product.types'

interface ProductsCardListProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onView?: (product: Product) => void
  onUpdatePrice?: (productId: string, newPrice: number) => void
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

export function ProductsCardList({ products, isLoading, onEdit, onView, onUpdatePrice }: ProductsCardListProps) {
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [editPriceValue, setEditPriceValue] = useState<number>(0)

  const handleStartEdit = (e: React.MouseEvent, productId: string, currentPrice: number) => {
    e.stopPropagation()
    setEditingPriceId(productId)
    setEditPriceValue(currentPrice)
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingPriceId(null)
  }

  const handleSaveEdit = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    if (onUpdatePrice) {
      onUpdatePrice(productId, editPriceValue)
    }
    setEditingPriceId(null)
  }

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

        const currentPrice = primaryVariant?.salePrice ?? 0
        const isEditing = editingPriceId === product.id

        return (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md cursor-pointer flex flex-col h-full"
            onClick={() => onView?.(product)}
          >
            <div className="relative h-40 shrink-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
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

            <div className="flex flex-col flex-1 p-4">
              <div className="mb-3">
                <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-800 h-[2.5rem]">{product.name}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">SKU: {primaryVariant?.internalSku ?? 'N/A'}</p>
              </div>

              <div className="mb-4">
                {isEditing ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Input
                      type="number"
                      className="h-8 w-28 font-mono text-sm font-bold bg-slate-50"
                      value={editPriceValue}
                      onChange={(e) => setEditPriceValue(Number(e.target.value))}
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={(e) => handleSaveEdit(e, product.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <p className="font-mono text-2xl font-bold text-indigo-600">
                      {currentPrice.toLocaleString('vi-VN')} ₫
                    </p>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600 p-1"
                      onClick={(e) => handleStartEdit(e, product.id, currentPrice)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <p className="font-semibold text-emerald-600">• Tồn: {metrics.stock}</p>
                  <p className="text-slate-400">Đã bán: {metrics.sold}</p>
                </div>

                <div className="grid grid-cols-3 border-t border-slate-100 pt-2 text-center text-xs font-medium text-slate-400 mb-3">
                  <p>Shopee: {metrics.shopee}</p>
                  <p>TikTok: {metrics.tiktok}</p>
                  <p>Lazada: {metrics.lazada}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={(event) => {
                      event.stopPropagation()
                      onEdit?.(product)
                    }}
                  >
                    Sửa chi tiết
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={(event) => {
                      event.stopPropagation()
                      onView?.(product)
                    }}
                  >
                    Xem
                  </Button>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
