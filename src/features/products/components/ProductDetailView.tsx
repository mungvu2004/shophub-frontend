import { useEffect, useState } from 'react'
import { ArrowLeft, PencilLine, Save, Wallet, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductDetailOverviewCard } from '@/features/products/components/product-detail/ProductDetailOverviewCard'
import { ProductDetailStatsGrid } from '@/features/products/components/product-detail/ProductDetailStatsGrid'
import { ProductDetailVariantsPanel } from '@/features/products/components/product-detail/ProductDetailVariantsPanel'
import { formatDateTime, money } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductDetailViewModel } from '@/features/products/logic/productDetailPage.types'
import { toast } from '@/components/ui/toast'

interface ProductDetailViewProps {
  model: ProductDetailViewModel
}

const MAX_GALLERY_IMAGES = 9

function isLikelyImageUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return false

  return normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:image/')
}

export function ProductDetailView({ model }: ProductDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editShortDescription, setEditShortDescription] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editModel, setEditModel] = useState('')
  const [editWarrantyInfo, setEditWarrantyInfo] = useState('')
  const [editMainImageUrl, setEditMainImageUrl] = useState('')
  const [editGalleryImageUrlsText, setEditGalleryImageUrlsText] = useState('')
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive' | 'Deleted'>('Active')

  useEffect(() => {
    if (!model.product) {
      return
    }

    setEditName(model.product.name)
    setEditBrand(model.product.brand ?? '')
    setEditShortDescription(model.product.shortDescription ?? '')
    setEditDescription(model.product.description ?? '')
    setEditModel(model.product.model ?? '')
    setEditWarrantyInfo(model.product.warrantyInfo ?? '')
    setEditMainImageUrl(model.product.variants[0]?.mainImageUrl ?? '')
    setEditGalleryImageUrlsText((model.product.variants[0]?.imagesJson ?? []).join('\n'))
    setEditStatus(model.product.status)
  }, [model.product])

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

  const resetEditValues = () => {
    setEditName(product.name)
    setEditBrand(product.brand ?? '')
    setEditShortDescription(product.shortDescription ?? '')
    setEditDescription(product.description ?? '')
    setEditModel(product.model ?? '')
    setEditWarrantyInfo(product.warrantyInfo ?? '')
    setEditMainImageUrl(product.variants[0]?.mainImageUrl ?? '')
    setEditGalleryImageUrlsText((product.variants[0]?.imagesJson ?? []).join('\n'))
    setEditStatus(product.status)
  }

  const galleryImageUrls = editGalleryImageUrlsText
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  const isGalleryOverLimit = galleryImageUrls.length > MAX_GALLERY_IMAGES
  const hasInvalidMainImage = editMainImageUrl.trim().length > 0 && !isLikelyImageUrl(editMainImageUrl)
  const hasInvalidGalleryImage = galleryImageUrls.some((item) => !isLikelyImageUrl(item))
  const canSaveEdit =
    !model.isUpdating
    && editName.trim().length > 0
    && !isGalleryOverLimit
    && !hasInvalidMainImage
    && !hasInvalidGalleryImage

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
              {!isEditing ? (
                <Button variant="outline" className="rounded-xl border-slate-300" onClick={() => setIsEditing(true)}>
                  <PencilLine className="size-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-300"
                    onClick={() => {
                      setIsEditing(false)
                      resetEditValues()
                    }}
                  >
                    <X className="size-4" />
                    Hủy
                  </Button>
                  <Button
                    className="rounded-xl"
                    disabled={!canSaveEdit}
                    onClick={async () => {
                      try {
                        const isSaved = await model.onSaveEdit({
                          name: editName.trim(),
                          brand: editBrand.trim(),
                          shortDescription: editShortDescription.trim(),
                          description: editDescription.trim(),
                          model: editModel.trim(),
                          warrantyInfo: editWarrantyInfo.trim(),
                          status: editStatus,
                          mainImageUrl: editMainImageUrl.trim(),
                          galleryImageUrls,
                        })

                        if (isSaved) {
                          toast.success('Đã cập nhật sản phẩm thành công.')
                          setIsEditing(false)
                        }
                      } catch {
                        toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.')
                      }
                    }}
                  >
                    <Save className="size-4" />
                    {model.isUpdating ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Tên sản phẩm</span>
                  <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Thương hiệu</span>
                  <Input value={editBrand} onChange={(event) => setEditBrand(event.target.value)} />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Mô tả ngắn</span>
                  <Input value={editShortDescription} onChange={(event) => setEditShortDescription(event.target.value)} />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Model</span>
                  <Input value={editModel} onChange={(event) => setEditModel(event.target.value)} />
                </label>

                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Mô tả chi tiết</span>
                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400"
                  />
                </label>

                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Thông tin bảo hành</span>
                  <Input value={editWarrantyInfo} onChange={(event) => setEditWarrantyInfo(event.target.value)} />
                </label>

                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Ảnh chính (URL)</span>
                  <Input value={editMainImageUrl} onChange={(event) => setEditMainImageUrl(event.target.value)} />
                  {hasInvalidMainImage ? <p className="text-xs text-rose-600">URL ảnh chính chưa hợp lệ (cần bắt đầu bằng http/https).</p> : null}

                  {editMainImageUrl.trim().length > 0 && !hasInvalidMainImage ? (
                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={editMainImageUrl}
                        alt="Preview ảnh chính"
                        className="h-40 w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : null}
                </label>

                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Danh sách ảnh (mỗi dòng một URL)</span>
                  <textarea
                    value={editGalleryImageUrlsText}
                    onChange={(event) => setEditGalleryImageUrlsText(event.target.value)}
                    rows={4}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={isGalleryOverLimit ? 'font-semibold text-rose-600' : 'text-slate-500'}>
                      {galleryImageUrls.length}/{MAX_GALLERY_IMAGES} ảnh
                    </span>
                    {isGalleryOverLimit ? <span className="text-rose-600">Đã vượt giới hạn ảnh an toàn cho đa sàn. Vui lòng giảm bớt.</span> : null}
                    {!isGalleryOverLimit ? <span className="text-slate-500">Khuyến nghị: tối đa 9 ảnh để đồng bộ ổn định lên Shopee/TikTok/Lazada.</span> : null}
                  </div>
                  {hasInvalidGalleryImage ? <p className="text-xs text-rose-600">Danh sách có URL ảnh chưa hợp lệ.</p> : null}

                  {galleryImageUrls.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-5">
                      {galleryImageUrls.slice(0, MAX_GALLERY_IMAGES).map((url) => (
                        <div key={url} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <img
                            src={url}
                            alt="Preview gallery"
                            className="h-20 w-full object-cover"
                            onError={(event) => {
                              const container = event.currentTarget.parentElement
                              if (container) {
                                container.innerHTML = '<p class="px-2 py-6 text-center text-[10px] text-rose-600">URL lỗi</p>'
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Trạng thái</span>
                  <select
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value as typeof editStatus)}
                    className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deleted">Deleted</option>
                  </select>
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ProductDetailStatsGrid stats={stats} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr]">
        <ProductDetailOverviewCard product={product} stats={stats} />
        <ProductDetailVariantsPanel product={product} inventoryItems={model.inventorySummary.items} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.5px] text-slate-500">Trigger đang áp dụng</h2>
            <p className="mt-1 text-xs text-slate-500">
              {model.triggersUpdatedAt ? `Cập nhật lúc ${formatDateTime(model.triggersUpdatedAt)}` : 'Dữ liệu trigger theo sản phẩm'}
            </p>
          </div>
          <span className="text-sm font-semibold text-indigo-700">{model.appliedTriggers.length} trigger</span>
        </div>

        {model.appliedTriggers.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {model.appliedTriggers.map((trigger) => (
              <article key={trigger.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{trigger.name}</p>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      trigger.status === 'active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {trigger.status === 'active' ? 'Đang bật' : 'Tạm dừng'}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-indigo-700">{trigger.scopeLabel}</p>
                <p className="mt-1 text-xs text-slate-600">{trigger.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Sản phẩm này chưa gán trigger tự động hóa nào.</p>
        )}
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
