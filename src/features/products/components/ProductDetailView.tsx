import { ArrowLeft, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductDetailOverviewCard } from '@/features/products/components/product-detail/ProductDetailOverviewCard'
import { ProductDetailStatsGrid } from '@/features/products/components/product-detail/ProductDetailStatsGrid'
import { ProductDetailVariantsPanel } from '@/features/products/components/product-detail/ProductDetailVariantsPanel'
import { formatDateTime, money } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductDetailViewModel } from '@/features/products/logic/productDetailPage.types'

interface ProductDetailViewProps {
  model: ProductDetailViewModel
}

export function ProductDetailView({ model }: ProductDetailViewProps) {
  if (model.isLoading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6">
        <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    )
  }

  if (model.isError || !model.product) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6">
        <h1 className="text-lg font-bold text-rose-700">Không thể tải chi tiết sản phẩm</h1>
        <p className="mt-2 text-sm text-rose-600">{model.errorMessage ?? 'Vui lòng thử lại sau.'}</p>
        <Button variant="outline" className="mt-4 rounded-xl" onClick={model.onBack}>
          <ArrowLeft className="size-4" />
          Quay về danh sách
        </Button>
      </div>
    )
  }

  const { product, stats } = model
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="relative isolate px-5 py-5 md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.18),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_42%)]" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Button variant="ghost" className="h-8 rounded-xl px-2 text-slate-600" onClick={model.onBack}>
                <ArrowLeft className="size-4" />
                Danh sách sản phẩm
              </Button>

              <div>
                <h1 className="max-w-4xl text-2xl font-black leading-tight text-slate-900 md:text-4xl">{product.name}</h1>
                <p className="mt-2 text-sm text-slate-600">ID: {product.id} • Cập nhật: {formatDateTime(product.updatedAt)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    product.status === 'Active'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}
                >
                  {product.status === 'Active' ? 'Đang bán' : 'Tạm dừng'}
                </span>
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {stats.totalVariants} biến thể
                </span>
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {stats.listedChannels} kênh
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-slate-300">Chỉnh sửa</Button>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailStatsGrid stats={stats} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr]">
        <ProductDetailOverviewCard product={product} stats={stats} />
        <ProductDetailVariantsPanel product={product} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Wallet className="size-4" />
            <p className="text-sm">Tổng quan tài chính sản phẩm</p>
          </div>
          <p className="text-sm font-semibold text-indigo-700">Giá trung bình hiện tại: {money(stats.avgPrice)}</p>
        </div>
      </section>
    </div>
  )
}
