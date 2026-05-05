import { useState } from 'react'
import { Calendar, ImageOff, Tag } from 'lucide-react'

import type { Product } from '@/types/product.types'
import { formatDateTime, getProductChannels, money, platformLabelMap } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductDetailStats } from '@/features/products/logic/productDetailPage.types'

type ProductDetailOverviewCardProps = {
  product: Product
  stats: ProductDetailStats
}

const channelColors: Record<string, string> = {
  shopee: 'border-orange-200 bg-orange-50 text-orange-700',
  tiktok_shop: 'border-slate-200 bg-slate-100 text-slate-700',
  lazada: 'border-sky-200 bg-sky-50 text-sky-700',
}

export function ProductDetailOverviewCard({ product, stats }: ProductDetailOverviewCardProps) {
  const firstVariant = product.variants[0]
  const channels = getProductChannels(product)

  const allImages = Array.from(
    new Set(
      [firstVariant?.mainImageUrl, ...(firstVariant?.imagesJson ?? [])].filter((url): url is string => !!url)
    )
  )

  const [activeImage, setActiveImage] = useState(0)
  const currentImage = allImages[activeImage]

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* Main Image */}
      {currentImage ? (
        <div className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ aspectRatio: '1 / 1' }}>
          <img
            key={currentImage}
            src={currentImage}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-6 drop-shadow-sm transition-opacity duration-200"
          />
          {allImages.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {activeImage + 1} / {allImages.length}
            </span>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 text-slate-400" style={{ aspectRatio: '1 / 1' }}>
          <ImageOff className="size-10 opacity-30" />
          <span className="text-sm font-medium">Không có ảnh sản phẩm</span>
        </div>
      )}

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
          {allImages.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              className={`relative shrink-0 h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                idx === activeImage
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="space-y-4 p-5">
        {/* Thông tin chung */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin chung</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Tag className="size-3.5" />
                Thương hiệu
              </span>
              <span className="font-semibold text-slate-900">{product.brand || '--'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="text-slate-500">Nguồn tạo</span>
              <span className="font-semibold text-slate-900">{product.source}</span>
            </div>
            {product.model && (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="text-slate-500">Model</span>
                <span className="font-semibold text-slate-900">{product.model}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="size-3.5" />
                Ngày tạo
              </span>
              <span className="font-semibold text-slate-900">{formatDateTime(product.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Giá bán */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Giá bán</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-[10px] text-slate-400 mb-0.5">Thấp nhất</p>
              <p className="text-sm font-bold text-slate-800">{money(stats.minPrice)}</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-center">
              <p className="text-[10px] text-indigo-500 font-semibold mb-0.5">Trung bình</p>
              <p className="text-sm font-bold text-indigo-700">{money(stats.avgPrice)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
              <p className="text-[10px] text-slate-400 mb-0.5">Cao nhất</p>
              <p className="text-sm font-bold text-slate-800">{money(stats.maxPrice)}</p>
            </div>
          </div>
        </div>

        {/* Kênh phân phối */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kênh phân phối</h2>
          {channels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {channels.map((channel) => (
                <span
                  key={channel}
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${channelColors[channel] ?? 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {platformLabelMap[channel] ?? channel}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Chưa có kênh nào được mapping.</p>
          )}
        </div>
      </div>
    </article>
  )
}
