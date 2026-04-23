import { ArrowLeft, PackageSearch } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { useInventoryStockAdjustmentPage } from '@/features/inventory/hooks/useInventoryStockAdjustmentPage'

type InventoryStockAdjustmentPageViewProps = {
  model: ReturnType<typeof useInventoryStockAdjustmentPage>
}

export function InventoryStockAdjustmentPageView({ model }: InventoryStockAdjustmentPageViewProps) {
  const {
    form,
    errors,
    selectedItem,
    selectedWarehouse,
    resolvedWarehouseId,
    selectedItemDescription,
    relatedVariants,
    normalizedDelta,
    simulation,
    isLoadingStock,
    isSubmitting,
    movementOptions,
    reasonOptions,
    warehouseOptions,
    onFieldChange,
    onBack,
    handleSubmit,
  } = model

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="relative isolate px-5 py-5 md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.14),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_42%)]" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Button variant="ghost" className="h-8 rounded-xl px-2 text-slate-600" onClick={onBack}>
                <ArrowLeft className="size-4" />
                Quay lại tồn kho
              </Button>

              <div>
                <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-4xl">Điều chỉnh tồn kho</h1>
                <p className="mt-2 text-sm text-slate-600">Cập nhật tồn kho cho SKU được chọn, xem toàn bộ thông tin và mô phỏng trước khi lưu.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {selectedItem ? selectedItem.sku : 'Chưa chọn SKU'}
                </span>
                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {selectedWarehouse?.name ?? 'Chưa chọn kho'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái thao tác</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {isSubmitting ? 'Đang lưu điều chỉnh...' : 'Sẵn sàng cập nhật'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        {/* Form */}
        <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
          {!selectedItem ? (
            <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <p className="font-semibold">Không có SKU được chọn</p>
              <p className="mt-1">Quay lại trang tồn kho SKU và chọn một SKU để điều chỉnh.</p>
            </div>
          ) : (
            <>
              {/* Selected SKU Display */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">SKU được chọn</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{selectedItem.sku}</p>
                  <p className="mt-1 text-xs text-slate-600">{selectedItem.productName ?? selectedItem.variantName ?? selectedItem.variantId}</p>
                </div>
              </div>

              {/* Warehouse Selection */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Kho áp dụng</p>
                <div className="flex flex-wrap gap-2">
                  {warehouseOptions.map((warehouse) => {
                    const isActive = warehouse.id === resolvedWarehouseId
                    return (
                      <button
                        key={warehouse.id}
                        type="button"
                        onClick={() => onFieldChange('warehouseId', warehouse.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${isActive ? 'border-sky-300 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                      >
                        {warehouse.name}
                      </button>
                    )
                  })}
                </div>
                {errors.warehouseId ? <p className="text-sm text-red-600">{errors.warehouseId}</p> : null}
              </div>

              {/* Delta and Movement Type */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="delta">
                    Số lượng thay đổi
                  </label>
                  <Input
                    id="delta"
                    type="number"
                    value={form.delta}
                    onChange={(event) => onFieldChange('delta', event.target.value)}
                    placeholder="Ví dụ: 10 hoặc -5"
                  />
                  {errors.delta ? <p className="text-sm text-red-600">{errors.delta}</p> : null}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Loại biến động</p>
                  <div className="flex flex-wrap gap-2">
                    {movementOptions.map((option) => {
                      const isActive = form.movementType === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onFieldChange('movementType', option.value)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${isActive ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                          title={option.helper}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-slate-500">
                    {movementOptions.find((option) => option.value === form.movementType)?.helper}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="reason">
                  Lý do điều chỉnh
                </label>
                <div className="flex flex-wrap gap-2">
                  {reasonOptions.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => onFieldChange('reason', reason)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${form.reason === reason ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <Input
                  id="reason"
                  list="inventory-adjustment-reasons-page"
                  value={form.reason}
                  onChange={(event) => onFieldChange('reason', event.target.value)}
                  placeholder="Chọn nhanh ở trên hoặc nhập lý do cụ thể"
                />
                <datalist id="inventory-adjustment-reasons-page">
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason} />
                  ))}
                </datalist>
                {errors.reason ? <p className="text-sm text-red-600">{errors.reason}</p> : null}
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="note">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  value={form.note}
                  onChange={(event) => onFieldChange('note', event.target.value)}
                  placeholder="Ghi chú nội bộ, mã phiếu, người xác nhận..."
                  className="min-h-24 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoadingStock}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu điều chỉnh'}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Right Panel */}
        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PackageSearch className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Chi tiết SKU được chọn</h2>
          </div>

          {selectedItem ? (
            <div className="space-y-3">
              {/* Product Card */}
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {selectedItem.productImage ? (
                  <img
                    src={selectedItem.productImage}
                    alt={selectedItem.sku}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-200 text-xs font-semibold text-slate-600">
                    Không có ảnh
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{selectedItem.productName ?? selectedItem.variantName ?? selectedItem.sku}</p>
                  <p className="text-xs text-slate-500">{selectedItemDescription}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">SKU: {selectedItem.sku}</Badge>
                    <Badge variant="outline">Variant: {selectedItem.variantId}</Badge>
                  </div>
                </div>
              </div>

              {/* Stock Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="rounded-lg bg-slate-50 px-2 py-1">Kho: <span className="font-semibold text-slate-700">{selectedWarehouse?.name ?? selectedItem.warehouseName}</span></div>
                <div className="rounded-lg bg-slate-50 px-2 py-1">Danh mục: <span className="font-semibold text-slate-700">{selectedItem.category ?? 'Chưa phân loại'}</span></div>
                <div className="rounded-lg bg-slate-50 px-2 py-1">Tồn thực tế: <span className="font-semibold text-slate-700">{selectedItem.physicalQty}</span></div>
                <div className="rounded-lg bg-slate-50 px-2 py-1">Đang giữ chỗ: <span className="font-semibold text-slate-700">{selectedItem.reservedQty}</span></div>
                <div className="rounded-lg bg-slate-50 px-2 py-1">Khả dụng: <span className="font-semibold text-slate-700">{selectedItem.availableQty}</span></div>
                <div className="rounded-lg bg-slate-50 px-2 py-1">Mức tối thiểu: <span className="font-semibold text-slate-700">{selectedItem.minThreshold}</span></div>
              </div>

              {/* Channel Stock */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">Shopee: {selectedItem.channelStock?.shopee ?? 0}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">TikTok: {selectedItem.channelStock?.tiktok ?? 0}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">Lazada: {selectedItem.channelStock?.lazada ?? 0}</span>
              </div>

              {/* Related Variants */}
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Biến thể cùng sản phẩm</p>
                {relatedVariants.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {relatedVariants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-slate-300"
                        disabled
                      >
                        {variant.sku}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Chưa có dữ liệu biến thể khác cho sản phẩm này.</p>
                )}
              </div>

              {/* Simulation Preview */}
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Mô phỏng sau điều chỉnh</p>
                <p className="mt-1">
                  Biến động ghi nhận: <span className="font-semibold text-slate-800">{normalizedDelta}</span>
                </p>
                <p className="mt-1">
                  Tồn thực tế mới: <span className="font-semibold text-slate-800">{simulation?.nextPhysical ?? '-'}</span>
                </p>
                <p className="mt-1">
                  Khả dụng mới: <span className="font-semibold text-slate-800">{simulation?.nextAvailable ?? '-'}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Chọn một SKU ở khung bên trái để xem thông tin tồn kho chi tiết trước khi điều chỉnh.
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}
