import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, Pencil, Image as ImageIcon } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { cn } from '@/lib/utils'

interface ProductsCardListProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onView?: (product: Product) => void
  onUpdatePrice?: (productId: string, newPrice: number) => void
}

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onView?: (product: Product) => void
  onUpdatePrice?: (productId: string, newPrice: number) => void
}

function ProductCard({ product, onEdit, onView, onUpdatePrice }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editPriceValue, setEditPriceValue] = useState<number>(0)

  const variants = product.variants ?? []
  const primaryVariant = variants[0]
  const currentPrice = primaryVariant?.salePrice ?? 0

  // Extract unique platforms
  const platforms = new Set<string>()
  product.variants?.forEach(v => {
     v.listings?.forEach(l => platforms.add(l.platform))
  })
  const platformArray = Array.from(platforms).slice(0, 2)
  const platformColors: Record<string, string> = { shopee: 'bg-orange-500', tiktok_shop: 'bg-slate-900', lazada: 'bg-indigo-600' }
  const platformLabels: Record<string, string> = { shopee: 'SHOPEE', tiktok_shop: 'TIKTOK', lazada: 'LAZADA' }

  const statusLabel = product.status === 'Active' ? 'Đang bán' : product.status === 'Inactive' ? 'Tạm dừng' : 'Hết hàng'
  const statusClass =
    product.status === 'Active'
      ? 'bg-emerald-500 text-white'
      : product.status === 'Inactive'
        ? 'bg-amber-500 text-white'
        : 'bg-rose-500 text-white'

  const stock = product.stock || 0
  const sold = product.sold || 0

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditPriceValue(currentPrice)
    setIsEditing(true)
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(false)
  }

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdatePrice?.(product.id, editPriceValue)
    setIsEditing(false)
  }

  return (
    <article
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md cursor-pointer flex flex-col h-full"
      onClick={() => onView?.(product)}
    >
      <div className="relative flex items-center justify-center h-40 shrink-0 bg-slate-100">
        <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
          {platformArray.map((platform) => (
            <span
              key={platform}
              className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm", platformColors[platform] ?? 'bg-slate-700')}
            >
              {platformLabels[platform] ?? platform.toUpperCase()}
            </span>
          ))}
          {platformArray.length === 0 && (
            <span className="rounded-md bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              CHƯA ĐỒNG BỘ
            </span>
          )}
        </div>
        <span className={cn("absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm z-10", statusClass)}>
          {statusLabel}
        </span>

        {primaryVariant?.mainImageUrl ? (
          <img src={primaryVariant.mainImageUrl} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <ImageIcon className="h-8 w-8 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Chưa có ảnh</span>
          </div>
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
                className="h-9 w-28 font-mono text-sm font-bold bg-slate-50"
                value={editPriceValue}
                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-9 w-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={handleSaveEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="inline-flex items-center gap-1.5 group cursor-pointer border-b border-dashed border-slate-300 pb-0.5 hover:border-slate-900 transition-colors"
              onClick={handleStartEdit}
              title="Nhấn để sửa giá nhanh"
            >
              <p className="font-mono text-2xl font-bold text-slate-900">
                {currentPrice.toLocaleString('vi-VN')} ₫
              </p>
              <Pencil className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm mb-4">
            <p className="font-semibold text-emerald-600" title="Số lượng sản phẩm còn lại trong kho">
              • Tồn: {stock}
            </p>
            <p className="text-slate-400" title="Tổng số lượng đã bán trong 30 ngày qua">
              Đã bán: {sold}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-semibold h-10 text-slate-600"
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
              className="rounded-xl font-semibold h-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
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
}

export function ProductsCardList({ products, isLoading, onEdit, onView, onUpdatePrice }: ProductsCardListProps) {
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
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onView={onView}
          onUpdatePrice={onUpdatePrice}
        />
      ))}
    </div>
  )
}
