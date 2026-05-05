import { useState } from 'react'
import React from 'react'
import { ArrowLeft, BadgeCheck, ChevronRight, Image as ImageIcon, Layers3, PencilLine, Save, ShieldCheck, Sparkles, Store, TrendingUp, Warehouse, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductDetailOverviewCard } from '@/features/products/components/product-detail/ProductDetailOverviewCard'
import { ProductDetailStatsGrid } from '@/features/products/components/product-detail/ProductDetailStatsGrid'
import { ProductDetailVariantsPanel } from '@/features/products/components/product-detail/ProductDetailVariantsPanel'
import { formatDateTime, money } from '@/features/products/components/product-detail/productDetail.utils'
import type { ProductDetailViewModel } from '@/features/products/logic/productDetailPage.types'
import { toast } from '@/components/ui/toast'

type TabId = 'overview' | 'variants' | 'inventory' | 'triggers'

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
  const [activeTab, setActiveTab] = useState<TabId>('overview')
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

  const [prevProduct, setPrevProduct] = useState(model.product)
  if (model.product !== prevProduct) {
    setPrevProduct(model.product)
    if (model.product) {
      setEditName(model.product.name)
      setEditBrand(model.product.brand ?? '')
      setEditShortDescription(model.product.shortDescription ?? '')
      setEditDescription(model.product.description ?? '')
      setEditModel(model.product.model ?? '')
      setEditWarrantyInfo(model.product.warrantyInfo ?? '')
      setEditMainImageUrl(model.product.variants?.[0]?.mainImageUrl ?? '')
      setEditGalleryImageUrlsText((model.product.variants?.[0]?.imagesJson ?? []).join('\n'))
      setEditStatus(model.product.status)
    }
  }

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

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Tổng quan', icon: <Sparkles className="size-3.5" /> },
    { id: 'variants', label: 'Biến thể', icon: <Layers3 className="size-3.5" />, count: stats.totalVariants },
    { id: 'inventory', label: 'Kho hàng', icon: <Warehouse className="size-3.5" /> },
    { id: 'triggers', label: 'Trigger', icon: <Zap className="size-3.5" />, count: model.appliedTriggers.length },
  ]

  return (
    <div className="space-y-4">
      {/* ── Hero Header ── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="relative isolate px-5 py-5 md:px-8 md:py-6">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.12),_transparent_50%),radial-gradient(ellipse_at_top_left,_rgba(14,165,233,0.10),_transparent_50%)]" />

          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
            <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1 font-medium hover:bg-slate-100 hover:text-slate-700 transition-colors" onClick={model.onBack}>
              <ArrowLeft className="size-3.5" />
              Sản phẩm
            </button>
            <ChevronRight className="size-3.5 text-slate-300" />
            <span className="max-w-xs truncate font-medium text-slate-700">{product.name}</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  product.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : product.status === 'Deleted'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}>
                  <BadgeCheck className="size-3" />
                  {product.status === 'Active' ? 'Đang bán' : product.status === 'Deleted' ? 'Đã xóa' : 'Tạm dừng'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                  <Layers3 className="size-3" />
                  {stats.totalVariants} biến thể
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  <Store className="size-3" />
                  {stats.listedChannels} kênh
                </span>
              </div>
              <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-3xl">{product.name}</h1>
              {product.shortDescription && (
                <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">{product.shortDescription}</p>
              )}
              <p className="mt-1.5 text-xs text-slate-400 font-mono">ID: {product.id} · Cập nhật: {formatDateTime(product.updatedAt)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" className="rounded-xl border-slate-300 gap-2" onClick={() => setIsEditing(true)}>
                  <PencilLine className="size-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="rounded-xl border-slate-300" onClick={() => { setIsEditing(false); resetEditValues() }}>
                    <X className="size-4" />
                    Hủy
                  </Button>
                  <Button
                    className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700"
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
                        if (isSaved) { toast.success('Đã cập nhật sản phẩm thành công.'); setIsEditing(false) }
                      } catch { toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.') }
                    }}
                  >
                    <Save className="size-4" />
                    {model.isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Tab Bar */}
        <div className="flex border-t border-slate-100 bg-slate-50/60 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Tab: Tổng quan ── */}
      {activeTab === 'overview' && (
        <>
          <ProductDetailStatsGrid stats={stats} />
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
            <ProductDetailOverviewCard product={product} stats={stats} />
            <div className="space-y-4">
              {/* Mô tả sản phẩm */}
              <article className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <Sparkles className="size-4 text-indigo-400" />
                  Mô tả sản phẩm
                </h2>
                {product.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{product.description}</p>
                ) : (
                  <p className="text-sm italic text-slate-400">Chưa có mô tả chi tiết.</p>
                )}
              </article>

              {/* Thông số kỹ thuật */}
              <article className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <ShieldCheck className="size-4 text-teal-400" />
                  Thông số & Bảo hành
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                  {[
                    { label: 'Model', value: product.model },
                    { label: 'Thương hiệu', value: product.brand },
                    { label: 'Nguồn tạo', value: product.source },
                    { label: 'Bảo hành', value: product.warrantyInfo },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-900">{value || '--'}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Tài chính */}
              <article className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <TrendingUp className="size-4 text-emerald-400" />
                  Tài chính
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-200 p-4 text-center">
                    <p className="text-xs text-slate-500">Giá thấp nhất</p>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">{money(stats.minPrice)}</p>
                  </div>
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-center">
                    <p className="text-xs text-indigo-600 font-semibold">Giá trung bình</p>
                    <p className="mt-1.5 text-lg font-bold text-indigo-700">{money(stats.avgPrice)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 text-center">
                    <p className="text-xs text-slate-500">Giá cao nhất</p>
                    <p className="mt-1.5 text-lg font-bold text-slate-900">{money(stats.maxPrice)}</p>
                  </div>
                </div>
              </article>

              {/* Gallery ảnh */}
              {(() => {
                const v = product.variants[0]
                const imgs = Array.from(new Set([v?.mainImageUrl, ...(v?.imagesJson ?? [])].filter(Boolean) as string[]))
                if (imgs.length === 0) return null
                return (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                      <ImageIcon className="size-4 text-sky-400" />
                      Hình ảnh sản phẩm
                      <span className="ml-auto text-[11px] font-normal normal-case text-slate-400">{imgs.length} ảnh</span>
                    </h2>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
                      {imgs.map((url, i) => (
                        <div key={i} className={`relative overflow-hidden rounded-2xl bg-slate-50 ${i === 0 ? 'col-span-2 row-span-2' : ''}`} style={{ aspectRatio: '1/1' }}>
                          {i === 0 && (
                            <span className="absolute top-2 left-2 z-10 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">Ảnh chính</span>
                          )}
                          <img src={url} alt={`Ảnh ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </article>
                )
              })()}
            </div>
          </section>
        </>
      )}

      {/* ── Tab: Biến thể ── */}
      {activeTab === 'variants' && (
        <ProductDetailVariantsPanel product={product} inventoryItems={model.inventorySummary.items} />
      )}

      {/* ── Tab: Kho hàng ── */}
      {activeTab === 'inventory' && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
            <Warehouse className="size-5 text-indigo-500" />
            Tổng quan kho hàng
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
            {[
              { label: 'Tổng tồn kho', value: model.inventorySummary.totalPhysicalQty, color: 'text-slate-900' },
              { label: 'Khả dụng', value: model.inventorySummary.totalAvailableQty, color: 'text-emerald-700' },
              { label: 'Đang giữ', value: model.inventorySummary.totalReservedQty, color: 'text-amber-600' },
              { label: 'Số kho', value: model.inventorySummary.warehouseCount, color: 'text-indigo-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Tồn kho theo kênh</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Shopee', value: model.inventorySummary.channelStock.shopee, color: 'border-orange-200 bg-orange-50 text-orange-700' },
              { label: 'TikTok Shop', value: model.inventorySummary.channelStock.tiktok, color: 'border-slate-200 bg-slate-50 text-slate-700' },
              { label: 'Lazada', value: model.inventorySummary.channelStock.lazada, color: 'border-sky-200 bg-sky-50 text-sky-700' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
                <p className="text-xs font-semibold mb-1">{label}</p>
                <p className="text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>

          {model.inventorySummary.items.length > 0 && (
            <>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Chi tiết theo kho</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {['SKU', 'Kho', 'Tồn thực', 'Đang giữ', 'Khả dụng'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {model.inventorySummary.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{item.sku}</td>
                        <td className="px-4 py-3 text-slate-600">{item.warehouseName}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{item.physicalQty}</td>
                        <td className="px-4 py-3 font-semibold text-amber-600">{item.reservedQty}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-700">{item.availableQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {model.isInventoryLoading && (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 mr-2" />
              Đang tải dữ liệu kho...
            </div>
          )}

          {!model.isInventoryLoading && model.inventorySummary.items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Warehouse className="size-12 text-slate-200 mb-3" />
              <p className="font-semibold text-slate-500">Chưa có dữ liệu tồn kho</p>
              <p className="mt-1 text-sm text-slate-400">Sản phẩm này chưa có bản ghi kho nào hoặc chưa được liên kết với SKU tồn kho.</p>
            </div>
          )}
        </section>
      )}

      {/* ── Tab: Trigger ── */}
      {activeTab === 'triggers' && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-900">Trigger tự động hóa</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-indigo-700">{model.appliedTriggers.length} trigger đang áp dụng</p>
              {model.triggersUpdatedAt && (
                <p className="text-xs text-slate-400">Cập nhật: {formatDateTime(model.triggersUpdatedAt)}</p>
              )}
            </div>
          </div>

          {model.appliedTriggers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {model.appliedTriggers.map((trigger) => (
                <article key={trigger.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-slate-900">{trigger.name}</p>
                    <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      trigger.status === 'active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}>
                      {trigger.status === 'active' ? 'Đang bật' : 'Tạm dừng'}
                    </span>
                  </div>
                  <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 mb-2">{trigger.scopeLabel}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{trigger.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Zap className="size-10 text-slate-200 mb-3" />
              <p className="font-semibold text-slate-500">Chưa có trigger nào</p>
              <p className="mt-1 text-sm text-slate-400">Sản phẩm này chưa được gán trigger tự động hóa.</p>
            </div>
          )}
        </section>
      )}
      {/* ── Edit Drawer ── */}
      {isEditing && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => { setIsEditing(false); resetEditValues() }}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl md:w-[520px]">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Chỉnh sửa sản phẩm</h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{product.name}</p>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                onClick={() => { setIsEditing(false); resetEditValues() }}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Thông tin cơ bản */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Thông tin cơ bản</legend>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Tên sản phẩm <span className="text-rose-500">*</span></span>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nhập tên sản phẩm..." />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">Thương hiệu</span>
                    <Input value={editBrand} onChange={(e) => setEditBrand(e.target.value)} placeholder="VD: Nike, Adidas..." />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">Model</span>
                    <Input value={editModel} onChange={(e) => setEditModel(e.target.value)} placeholder="VD: M-001..." />
                  </label>
                </div>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Mô tả ngắn</span>
                  <Input value={editShortDescription} onChange={(e) => setEditShortDescription(e.target.value)} placeholder="Một dòng mô tả ngắn gọn..." />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Mô tả chi tiết</span>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    placeholder="Mô tả đầy đủ về sản phẩm..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Thông tin bảo hành</span>
                  <Input value={editWarrantyInfo} onChange={(e) => setEditWarrantyInfo(e.target.value)} placeholder="VD: Bảo hành 12 tháng chính hãng..." />
                </label>
              </fieldset>

              <hr className="border-slate-100" />

              {/* Trạng thái */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Trạng thái</legend>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'Active', label: 'Đang bán', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
                    { value: 'Inactive', label: 'Tạm dừng', color: 'border-amber-300 bg-amber-50 text-amber-700' },
                    { value: 'Deleted', label: 'Đã xóa', color: 'border-rose-300 bg-rose-50 text-rose-700' },
                  ] as const).map(({ value, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEditStatus(value)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                        editStatus === value ? color : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <hr className="border-slate-100" />

              {/* Ảnh */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Hình ảnh</legend>
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Ảnh chính (URL)</span>
                  <Input value={editMainImageUrl} onChange={(e) => setEditMainImageUrl(e.target.value)} placeholder="https://..." />
                  {hasInvalidMainImage && <p className="text-xs text-rose-600">URL ảnh chưa hợp lệ.</p>}
                  {editMainImageUrl.trim().length > 0 && !hasInvalidMainImage && (
                    <div className="flex gap-3 items-center mt-2">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={editMainImageUrl} alt="Preview" className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      </div>
                      <p className="text-xs text-slate-400">Preview ảnh chính</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Gallery (mỗi dòng một URL)</span>
                    <span className={`text-xs font-bold ${isGalleryOverLimit ? 'text-rose-600' : 'text-slate-400'}`}>
                      {galleryImageUrls.length}/{MAX_GALLERY_IMAGES}
                    </span>
                  </div>
                  <textarea
                    value={editGalleryImageUrlsText}
                    onChange={(e) => setEditGalleryImageUrlsText(e.target.value)}
                    rows={4}
                    placeholder="https://image1.jpg&#10;https://image2.jpg&#10;..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none font-mono"
                  />
                  {isGalleryOverLimit && <p className="text-xs text-rose-600">Vượt giới hạn 9 ảnh. Giảm bớt để đồng bộ ổn định lên Shopee/TikTok/Lazada.</p>}
                  {hasInvalidGalleryImage && <p className="text-xs text-rose-600">Có URL ảnh không hợp lệ.</p>}
                  {galleryImageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {galleryImageUrls.slice(0, MAX_GALLERY_IMAGES).map((url, i) => (
                        <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 group">
                          <img src={url} alt="" className="h-full w-full object-cover"
                            onError={(e) => { const p = e.currentTarget.parentElement; if (p) p.innerHTML = '<div class="grid h-full place-items-center text-[9px] text-rose-500">Lỗi</div>' }} />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">#{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </fieldset>
            </div>

            {/* Drawer footer */}
            <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => { setIsEditing(false); resetEditValues() }}
              >
                Hủy bỏ
              </Button>
              <Button
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2"
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
                    if (isSaved) { toast.success('Đã cập nhật sản phẩm thành công.'); setIsEditing(false) }
                  } catch { toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.') }
                }}
              >
                <Save className="size-4" />
                {model.isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
