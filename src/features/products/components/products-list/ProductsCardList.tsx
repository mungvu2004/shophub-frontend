import { Image as ImageIcon, Pencil } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { cn } from '@/lib/utils'
import { PLATFORM_CONFIG } from '../../constants/platformConfig'

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
}

function ProductCard({ product, onEdit, onView }: ProductCardProps) {
  const variants = product.variants ?? []
  const primaryVariant = variants[0]
  const currentPrice = primaryVariant?.salePrice ?? 0

  const platforms = new Set<string>()
  product.variants?.forEach(v => {
     v.listings?.forEach(l => platforms.add(l.platform))
  })
  const platformArray = Array.from(platforms)

  const statusLabel = product.status === 'Active' ? 'Đang bán' : product.status === 'Inactive' ? 'Tạm dừng' : 'Hết hàng'
  const statusColors =
    product.status === 'Active'
      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      : product.status === 'Inactive'
        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'

  const stock = product.stock || 0
  const sold = product.sold || 0

  return (
    <article
      className="group relative flex flex-col h-full rounded-[24px] border border-slate-100 bg-white p-3 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer"
      onClick={() => onView?.(product)}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-slate-50">
        {primaryVariant?.mainImageUrl ? (
          <img src={primaryVariant.mainImageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-200">
            <ImageIcon className="size-10" />
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {platformArray.map((p) => (
            <div key={p} className={cn("size-5 rounded-full border-2 border-white shadow-sm shrink-0", PLATFORM_CONFIG[p]?.color || 'bg-slate-400')} title={PLATFORM_CONFIG[p]?.label || p} />
          ))}
        </div>
        
        <div className={cn("absolute right-2.5 top-2.5 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm", statusColors)}>
           {statusLabel}
        </div>

        {/* Quick Stock Indicator */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
           <div className="flex items-center justify-between rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-white/60 uppercase leading-none">Tồn kho</span>
                <span className={cn("text-xs font-black", stock < 50 ? "text-rose-400" : "text-emerald-400")}>{stock}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-bold text-white/60 uppercase leading-none">Đã bán</span>
                <span className="text-xs font-black text-white">{sold}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col pt-4 px-1 pb-1">
        <div className="mb-2">
           <div className="flex items-start justify-between gap-2">
             <h3 className="line-clamp-2 text-sm font-bold text-slate-900 leading-snug flex-1">{product.name}</h3>
             <button 
               className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
               onClick={(e) => { e.stopPropagation(); onEdit?.(product) }}
             >
               <Pencil className="size-3.5" />
             </button>
           </div>
           <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{primaryVariant?.internalSku || 'NO-SKU'}</p>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline justify-between border-t border-slate-50 pt-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Giá niêm yết</p>
              <p className="font-mono text-xl font-black text-slate-900 leading-none">
                {currentPrice.toLocaleString('vi-VN')}
                <span className="ml-1 text-xs font-bold">₫</span>
              </p>
            </div>
            <div className="text-right">
               <span className="inline-block rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">
                 +{product.margin || 0}%
               </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
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
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  )
}
